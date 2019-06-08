<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #fffff0;
    border-radius: 4px;
    overflow: hidden;
    float:left;
}
.layout-sider {
    bottom:0px;
    height:100%;
    border: 1px solid #d7dde4;
    z-index: 1;
}
.layout-content {
    float: left;
}

</style>
<template>
  <layout>
    <div class="layout">
                <Sider hide-trigger :style="{background: '#fff'}" class="layout-sider">
                    <Menu active-name="1" theme="light" width="auto" :open-names="['1']">
                      <router-link to="/MainPage/my_task/my_acceptTask">
                        <MenuItem name="1-1">接受的任务</MenuItem>
                      </router-link>
                      <router-link to="/MainPage/my_task/my_releaseTask">
                        <MenuItem name="1-2">发布的任务</MenuItem>
                      </router-link>
                    </Menu>
                </Sider>
    </div>
    <div style="width:100%">

            <router-view></router-view>

    </div>
  </layout>
</template>
<script>
    export default {

    }
</script>
