# OpenIM SDK for Web、uni-app and MiniProgram

> [中文文档](https://doc.rentsoft.cn/#/js_v2/sdk_integrate/development)

## About us

Open im includes instant messaging and real-time audio and video server and client SDK, which realizes important features such as high performance, lightweight and easy expansion. By integrating open im components and privatizing the deployment server, developers can quickly integrate instant messaging and real-time audio and video interaction into their own applications free of charge, and ensure the security and privacy of business data.[Click here](https://doc.rentsoft.cn) to visit our official website to learn more about Open IM.



## Getting Started

### How To Install

- To use the SDK in the React、Vue、uniapp、wx MiniProgram...

  ```bash
  npm install open-im-sdk
  ```

  Then within your application,you can import it.

  ```typescript
  import { OpenIMSDK } from 'open-im-sdk'
  const openIM = new OpenIMSDK();
  ```

  

## More Info

### Example

- Login open IM server

  ```typescript
  const config: InitConfig = {
    userID: "xxx",
    token: "xxx",
    url: "xxx",
    platformID: 5,
  };
  openIM.login(config).then(res => {
    console.log("login suc...");
  }).catch(err => {
    console.log("login failed...");
  })
  ```

- Create and send a message to another

  ```typescript
  const sendMsgDemo = async () => {
    const textStr = "hello open im";
  	const {data} = await openIM.createTextMessage(textStr);
  	const params = {
  	  recvID: "xxx",
  	  groupID: "",
  	  message: data,
  	};
  	openIM.sendMessage(params);
  }
  
  //You can listen to the message sending status and handle it in the callback function
  const msgListener = () => {
    openIM.on(CbEvents.ONRECVNEWMESSAGE,data => {
      // receive new message...
    })
  }
  ```

- Get more API list and demo you can visit [Our Developer Guide](https://doc.rentsoft.cn/)



## Getting Help

The best way to interact with our team is through GitHub.You can open an issue with this.You can also find some Doc in [Our Developer Guide](https://doc.rentsoft.cn/) or visit [Our Community](https://forum.rentsoft.cn/) to raise a query.

