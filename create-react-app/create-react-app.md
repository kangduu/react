#### 新建与更新


```
npx create-react-app name

// update
npm install react-scripts@latest
```



#### 使用react-create-app创建的项目，如何修改webpack配置

##### 暴露配置文件

项目根目录下执行`npm run eject`命令。通常是会**报错**的，下面是如何处理报错

```
git init 

git add .   // 注意这里有一个 . 

git commit -m 'init'

npm run eject
```

##### 配置 less

默认情况下，使用create-react-app创建的项目是不支持less的，但是我们使用antd UI 组件却使用的是less预处理器。

