# Read from kinesis stream sample

1 - Clone the project

2 - Install dependencies

```bash
npm install
```

3 - setup aws credentials based on environment `read-from-kinesis.js` (only needed environment)

e.g
```bash
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
```

4 - Run the script for specific environment

```bash
node read-from-kinesis.js dev
```

## PS:

When there is some information into kinesis stream, the output will be printed by `console.log()`

### Extra:

If is needed to get all the shards from kinesis:

```bash
# 1 - Login aws
aws sso login

# 2 - Get shards by stream-name
aws kinesis describe-stream --stream-name dev-dm-updates
```

output:
```json
{
    "StreamDescription": {
        "Shards": [
            {
                "ShardId": "shardId-000000000007",
                "ParentShardId": "shardId-000000000006",
                "HashKeyRange": {
                    "StartingHashKey": "85070591730234615865843651857942052863",
                    "EndingHashKey": "127605887595351923798765477786913079293"
                },
                "SequenceNumberRange": {
                    "StartingSequenceNumber": "49634934137483273569027796263865805239854264482564931698"
                }
            },
            {
                "ShardId": "shardId-000000000008",
                "ParentShardId": "shardId-000000000006",
                "HashKeyRange": {
                    "StartingHashKey": "127605887595351923798765477786913079294",
                    "EndingHashKey": "170141183460469231731687303715884105726"
                },
                "SequenceNumberRange": {
                    "StartingSequenceNumber": "49634934137505574314226326887007340958126912844070912130"
                }
            },
            ...
```

