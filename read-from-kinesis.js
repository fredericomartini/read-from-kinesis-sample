const AWS = require("aws-sdk");

const environment = process.argv[2];

if(! ['qa', 'uat', 'dev', 'devlab'].includes(environment)) {
  throw new Error(`Invalid environment => ${environment}, should be one of: [dev|qa|uat|devlab].`);
}

const createKinesisInstance = () => {
  let STREAM_NAME;
  let AWS_SECRET_ACCESS_KEY;
  let AWS_ACCESS_KEY_ID;
  let AWS_SESSION_TOKEN;

  const envs = {
    uat: () => {
      AWS_ACCESS_KEY_ID="";
      AWS_SECRET_ACCESS_KEY="";
      AWS_SESSION_TOKEN="";
      STREAM_NAME = "uat-green-dm-updates";
    },
    dev: () => {
      AWS_ACCESS_KEY_ID="";
      AWS_SECRET_ACCESS_KEY="";
      AWS_SESSION_TOKEN="";
                              
      STREAM_NAME = "dev-dm-updates";;
    },
    devlab: () => {
      AWS_ACCESS_KEY_ID="";
      AWS_SECRET_ACCESS_KEY="";
      AWS_SESSION_TOKEN="";

      STREAM_NAME = "devlab-dm-updates";
    },
    qa: () => {
      AWS_ACCESS_KEY_ID="";
      AWS_SECRET_ACCESS_KEY="";
      AWS_SESSION_TOKEN="";
      STREAM_NAME = "qa-dm-updates";
    }
  };

  envs[environment]();

  return new AWS.Kinesis({
    region: "us-east-1",
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: AWS_SESSION_TOKEN
    },
    params: { StreamName: STREAM_NAME }
  });
};

const options = {
  shardId: "shardId-000000000001", // defaults to first shard in the stream
  iterator: "LATEST", // default to TRIM_HORIZON
  // startAfter: "49632833846788658356984961722858970000003120226291941426", // start reading after this sequence number
  // startAt: "49632833846788658356984961722858970000003120226291941426", // start reading from this sequence number
  limit: 1 // number of records per `data` event
};

const KINESIS = createKinesisInstance();

const startReading = (shardId) => {
  const readable = require("kinesis-readable")(KINESIS, {
    ...options,
    shardId
  });

  console.info(
    `... Start reading from Kinesis streamName:: [${KINESIS.config.params.StreamName}] - shardID:: [${shardId}] ...`,
    new Date().toISOString()
  );

  readable
    // 'data' events will trigger for a set of records in the stream
    .on("data", function (records) {
      const [{ Data: data, ...rest }] = records;
      const dataAsJson = JSON.parse(Buffer.from(data));
      console.log(dataAsJson);
      // if(dataAsJson.from === 'localhost') {
      //   console.log({
      //     ...rest,
      //     data: {
      //       ...dataAsJson,
      //       message: {
      //         ...JSON.parse(dataAsJson.message),
      //         payload: JSON.stringify(JSON.parse(JSON.parse(dataAsJson.message).payload), null, 2)
      //       }
      //     }
      //   });
      // }
    })
    // each time a records are passed downstream, the 'checkpoint' event will provide
    // the last sequence number that has been read
    .on("checkpoint", function (sequenceNumber) {
      // console.log(sequenceNumber);
    })
    .on("error", function (err) {
      console.error(err);
    })
    .on("end", function () {
      console.log("all done!");
    });

  // Calling .close() will finish all pending GetRecord requests before emitting
  // the 'end' event.
  // Because the kinesis stream persists, the readable stream will not
  // 'end' until you explicitly close it
  setTimeout(function () {
    readable.close();
  }, 60 * 60 * 100000);
};

const startReadingFromEnv = () => {
  const envs = {
    dev: () => {
      startReading("shardId-000000000007");
      startReading("shardId-000000000008");
      startReading("shardId-000000000009");
      startReading("shardId-000000000010");
      startReading("shardId-000000000011");
      startReading("shardId-000000000012");
      startReading("shardId-000000000013");
      startReading("shardId-000000000014");
    },
    qa: () => {
      startReading("shardId-000000000003");
      startReading("shardId-000000000006");
      startReading("shardId-000000000007");
    },
    uat: () => {
      startReading("shardId-000000000000");
    },
    devlab: ()=>{
      startReading("shardId-000000000000");
    }
  };

  envs[environment]();
};

startReadingFromEnv();
