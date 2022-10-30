const tencentcloud = require("tencentcloud-sdk-nodejs");
const DnspodClient = tencentcloud.dnspod.v20210323.Client;
const [, , CERTBOT_DOMAIN, CERTBOT_VALIDATION, type, secretId, secretKey] = process.argv

const { Domain, SubDomain } = ((path) => {
    const lastIndex = path.lastIndexOf(".");
    const secondLastIndex = path.lastIndexOf(".", lastIndex - 1);
    return {
        Domain: path.substring(secondLastIndex + 1),
        SubDomain: "_acme-challenge." + path.substring(0, secondLastIndex),
    };
})(CERTBOT_DOMAIN)

// 实例化
const client = new DnspodClient({
    credential: {
        secretId,
        secretKey,
    },
    region: "",
    profile: {
        httpProfile: {
            endpoint: "dnspod.tencentcloudapi.com",
        },
    },
});
if (type === "add") {
    // 新增解析记录
    client.CreateRecord({ Domain, SubDomain, RecordType: "TXT", RecordLine: "默认", Value: CERTBOT_VALIDATION })
} else {
    // 查询解析记录并删除解析记录
    (async () => {
        const { RecordId } = (await client.DescribeRecordList({ Domain })).RecordList.find(item => {
            return item.Name === SubDomain && item.Value === CERTBOT_VALIDATION && item.Type === "TXT"
        })
        client.DeleteRecord({ Domain, RecordId })
    })()
}