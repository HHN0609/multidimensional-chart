<template>
  <Layout class="home-page">
    <LayoutSider theme="light" class="sider" collapsible>
      <Menu theme="light" mode="inline" @click="switchTitle" v-model:selectedKeys="selectedKeys">
        <MenuItem v-for="{key, name, icon} in siderConfig" :key="key">
          <Component :is="icon"></Component>
          <span>{{ name }}</span>
        </MenuItem>
      </Menu>
    </LayoutSider>

    <Layout class="main">
      <LayoutHeader class="header">
        <strong>{{ headerTitle }}</strong>
      </LayoutHeader>
      <LayoutContent class="content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </LayoutContent>
    </Layout>
  </Layout>
</template>
<script lang="ts" setup>
import { Layout, LayoutContent, LayoutHeader, LayoutSider, Menu, MenuItem } from "ant-design-vue";
import { onMounted, ref } from "vue";
import router from "@/router";
import siderConfig from "./siderConfig";

const selectedKeys = ref<string[]>(["1"]);
const headerTitle = ref<string>("");

const switchTitle = (event: any) => {
  siderConfig.forEach((value) => {
    if(event.key === value.key){
      headerTitle.value = value.name;
      router.push({ name: value.routeName });
    }
  });
};

// 刷新页面，侧边栏不变
onMounted(() => {
  for(let value of siderConfig) {
    if(router.currentRoute.value.name === value.routeName){
      selectedKeys.value = [`${value.key}`];
      headerTitle.value = value.name;
      break;
    }
  }
});
</script>
<style lang="less" scoped>
.home-page {
  width: 100%;
  height: 100%;
  .main {
    > .header {
      height: 50px;
      background: #fff;
      display: flex;
      align-items: center;
    }
    > .content {
      background: #fff;
      overflow-x: auto;
      overflow-y: auto;
    }
  }
}
</style>
