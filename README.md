# nestjs项目初始化

为今后所有的nestjs项目作初始化，方便开发～

## .env内容

```bash
DATABASE_URL = "mysql://root:locnelor@localhost:3306/init_apollo"
PORT = 14500
JWT_SECRET = "sbppk"

TITLE = "document"
DESCRIPTION = "documentAPI"
VERSION = "1.0"
REDIS_HOST = "localhost"
REDIS_PORT = 6379
REDIS_PASSWORD = "root1234"
CACHE_TTL = 21600
```

## libs功能

- file：文件目录包
- hash：加密包
- logger：日志包
- prisma：orm
- redis-cache
- request：请求包
- utils：各种工具包，
  - random-name：随机名称

## 登录逻辑 auth

使用jwt-tokwn验证实现登录

## apollo-server

很喜欢graphql
