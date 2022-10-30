#!/bin/bash

# 命令行路径,请阅读README.md进行配置
NODE=""
# 密钥可前往https://console.cloud.tencent.com/cam/capi网站进行获取
secretId="secretId"
secretKey="secretKey"

$NODE $(cd `dirname $0`; pwd)"/app.js" $CERTBOT_DOMAIN $CERTBOT_VALIDATION $1 $secretId $secretKey

if [[ "$1" == "add" ]]; then
        # 等待30秒 让DNS TXT记录生效
        /bin/sleep 30
fi