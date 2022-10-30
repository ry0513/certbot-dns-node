### 原因
在 certbot 中，对于通配符证书，不管是申请还是续期，都只能采用 dns-01 的方式校验申请者的域名，手动添加对应的 DNS TXT 记录。申请的证书有效期为90天，也就是每隔一段时间便要去操作一番上述操作，过于麻烦。
在 certbot 官方中并没有 **腾讯云** 的插件或例子，所以我编写这个工具。

### 前置环境
- certbot ( 开发者版本 v1.12.0 )
- nodeJs ( 开发者版本 v16.17.0 )
- debian ( 开发者系统 debian 11 )
其他系统/版本未测试，请自行测试

### 下载

```
$ git clone https://github.com/ry0513/certbot-dns-node.git
$ cd certbot-dns-node
$ npm install
$ chmod 0777 certbot-dns.sh
```

### 配置 certbot-dns.sh

  - 1： 配置node命令行路径
    ```
    $ npm run getpath
    ```

  - 2：配置密钥

    密钥可前往[ 腾讯云 ](https://console.cloud.tencent.com/cam/capi)网站进行获取

### 申请证书

- 先测试一下是否有错误

  ```
  certbot certonly --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory --manual-  auth-hook "/脚本所在目录/certbot-dns.sh add" --manual-cleanup-hook "/脚本所在目录/certbot-dns.sh clean" -d *.example.com --dry-run 
  ```
  **certbot-dns.sh参数说明**
  - add  添加解析记录
   - clean 删除解析记录

  **certbot参数说明**
  - certonly：表示采用验证模式，只会获取证书，不会为web服务器配置证书
  - --manual：表示使用插件
  - --preferred-challenges dns：表示使用DNS验证
  - --dry-run：在实际申请/更新证书前进行测试是否成功
  - -d：表示域名，可以有多个。
  - --manual-auth-hook：在**验证前**调用一个 hook 文件（新增 DNS TXT 记录）
  - --manual-cleanup-hook：在**验证后**调用一个 hook 文件（删除 DNS TXT 记录）
  - 具体说明可前往[ certbot文档 ](https://eff-certbot.readthedocs.io/en/stable/using.html#manual)查看

-  实际申请（去除 --dry-run 参数）

    ```
    certbot certonly --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory --manual-auth-hook "/脚本所在目录/certbot-dns.sh add" --manual-cleanup-hook "/脚本所在目录/certbot-dns.sh clean" -d *.example.com 
    ```

### 查看本机已安装证书
```
certbot certificates
```


 ### 续期证书

 - 对所有证书续签(只对即将过期的证书续期，无视剩余时间续期可在后面添加参数 **--force-renewal** )
   ```
   certbot renew --manual --preferred-challenges dns --manual-auth-hook "/脚本所在目录/certbot-dns.sh add" --manual-cleanup-hook "/脚本所在目录/certbot-dns.sh clean"
   ```
- 自动续期
  ```
  待定
  ```
