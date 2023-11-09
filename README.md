# MiniProgram SDK for OpenIM 👨‍💻💬

Use this SDK to add instant messaging capabilities to your application. By connecting to a self-hosted [OpenIM](https://www.openim.io/) server, you can quickly integrate instant messaging capabilities into your app with just a few lines of code.

`open-im-sdk-web` is a pure javascript library. It doesn't store any information inside browser, instead it connects to [oimws](https://github.com/openim-sigs/oimws) the proxy layer. This proxy layer is [OpenIM SDK Core](https://github.com/openimsdk/openim-sdk-core.git)'s websocket proxy(listening on port `10003` by deafult). open-im-sdk-web and open-im-sdk-web-wasm's interfaces are completely the same. Without modifying any code, your website can run in mini-app.

## Documentation 📚

Visit [https://docs.openim.io/](https://docs.openim.io/) for detailed documentation and guides.

For the SDK reference, see [https://docs.openim.io/sdks/quickstart/browser](https://docs.openim.io/sdks/quickstart/browser).

## Installation 💻

### Adding Dependencies

```shell
npm install open-im-sdk-web --save
```

## Usage 🚀

The following examples demonstrate how to use the SDK. TypeScript is used, providing complete type hints.

### Importing the SDK

```typescript
import { OpenIMSDK } from 'open-im-sdk-web';

const OpenIM = new OpenIMSDK();
```

### Logging In and Listening for Connection Status

> Note: You need to [deploy](https://github.com/openimsdk/open-im-server#rocket-quick-start) OpenIM Server first, the default port of OpenIM Server is 10001, 10002.

```typescript
import { CbEvents } from 'open-im-sdk-web';
import type { WsResponse } from 'open-im-sdk-web';

OpenIM.on(CbEvents.OnConnecting, handleConnecting);
OpenIM.on(CbEvents.OnConnectFailed, handleConnectFailed);
OpenIM.on(CbEvents.OnConnectSuccess, handleConnectSuccess);

OpenIM.login({
  userID: 'IM user ID',
  token: 'IM user token',
  platformID: 5,
  wsAddr: 'ws://your-server-ip:10001',
  apiAddr: 'http://your-server-ip:10002',
});

function handleConnecting() {
  // Connecting...
}

function handleConnectFailed({ errCode, errMsg }: WsResponse) {
  // Connection failed ❌
  console.log(errCode, errMsg);
}

function handleConnectSuccess() {
  // Connection successful ✅
}
```

To log into the IM server, you need to create an account and obtain a user ID and token. Refer to the [access token documentation](https://docs.openim.io/restapi/userManagement/userRegister) for details.

### Receiving and Sending Messages 💬

OpenIM makes it easy to send and receive messages. By default, there is no restriction on having a friend relationship to send messages (although you can configure other policies on the server). If you know the user ID of the recipient, you can conveniently send a message to them.

```typescript
import { CbEvents } from 'open-im-sdk-web';
import type { WsResponse, MessageItem } from 'open-im-sdk-web';

// Listenfor new messages 📩
OpenIM.on(CbEvents.OnRecvNewMessages, handleNewMessages);

const message = (await OpenIM.createTextMessage('hello openim')).data;

OpenIM.sendMessage({
  recvID: 'recipient user ID',
  groupID: '',
  message,
})
  .then(() => {
    // Message sent successfully ✉️
  })
  .catch(err => {
    // Failed to send message ❌
    console.log(err);
  });

function handleNewMessages({ data }: WsResponse<MessageItem[]>) {
  // New message list 📨
  console.log(data);
}
```

## Examples 🌟

You can find a demo web app that uses the SDK in the [openim-pc-web-demo](https://github.com/openimsdk/open-im-pc-web-demo) repository.

## Community :busts_in_silhouette:

- 📚 [OpenIM Community](https://github.com/OpenIMSDK/community)
- 💕 [OpenIM Interest Group](https://github.com/Openim-sigs)
- 🚀 [Join our Slack community](https://join.slack.com/t/openimsdk/shared_invite/zt-22720d66b-o_FvKxMTGXtcnnnHiMqe9Q)
- :eyes: [Join our wechat (微信群)](https://openim-1253691595.cos.ap-nanjing.myqcloud.com/WechatIMG20.jpeg)

## Community Meetings :calendar:

We want anyone to get involved in our community and contributing code, we offer gifts and rewards, and we welcome you to join us every Thursday night.

Our conference is in the [OpenIM Slack](https://join.slack.com/t/openimsdk/shared_invite/zt-22720d66b-o_FvKxMTGXtcnnnHiMqe9Q) 🎯, then you can search the Open-IM-Server pipeline to join

We take notes of each [biweekly meeting](https://github.com/orgs/OpenIMSDK/discussions/categories/meeting) in [GitHub discussions](https://github.com/openimsdk/open-im-server/discussions/categories/meeting), Our historical meeting notes, as well as replays of the meetings are available at [Google Docs :bookmark_tabs:](https://docs.google.com/document/d/1nx8MDpuG74NASx081JcCpxPgDITNTpIIos0DS6Vr9GU/edit?usp=sharing).

## Who are using OpenIM :eyes:

Check out our [user case studies](https://github.com/OpenIMSDK/community/blob/main/ADOPTERS.md) page for a list of the project users. Don't hesitate to leave a [📝comment](https://github.com/openimsdk/open-im-server/issues/379) and share your use case.

## License :page_facing_up:

OpenIM is licensed under the Apache 2.0 license. See [LICENSE](https://github.com/openimsdk/open-im-server/tree/main/LICENSE) for the full license text.
