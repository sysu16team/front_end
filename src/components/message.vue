<template>
  <div class="div-message">
    <ul>
      <li v-for="(msg, index) in message" :key="msg.id" class="li-msg">
        <template v-if="joinTeamType.includes(msg.type)">
          <span style="float: left;">
            <span class="jump-link user-link" @click="jumpToUser(msg.msg_username)">{{msg.msg_username}}</span>
            <span>申请加入小组</span>
            <span class="jump-link team-link" @click="jumpToTeam(msg.msg_team_id)">{{msg.msg_team_name}}</span>
          </span>
          <span style="float: right; width: 60px">
            <Select v-model="accTeamJoin[index]"
                    @on-change="handleTeamJoin(msg.type,msg.msg_team_id,msg.msg_username,index)">
              <Option :value="-1" :key="-1">选择</Option>
              <Option :value="1" :key="1">同意</Option>
              <Option :value="0" :key="0">拒绝</Option>
            </Select>
          </span>
        </template>

        <template v-else-if="msg.type==1">
          <span style="float: left;">
            <span>你已进入小组</span>
            <span class="jump-link team-link" @click="jumpToTeam(msg.msg_team_id)">{{msg.msg_team_name}}</span>
          </span>
        </template>

        <template v-else-if="msg.type==2">
          <span style="float: left;">
            <span>你被踢出小组</span>
            <span class="jump-link team-link" @click="jumpToTeam(msg.msg_team_id)">{{msg.msg_team_name}}</span>
          </span>
        </template>


        <template v-else-if="msg.type==3">
          <span style="float: left;">
            <span>你加入的小组</span>
            <span class="jump-link team-link" @click="jumpToTeam(msg.msg_team_id)">{{msg.msg_team_name}}</span>
            <span>被解散</span>
          </span>
        </template>


        <template v-else-if="msg.type==4">
          <span style="float: left;">
            <span>你被设为小组</span>
            <span class="jump-link team-link" @click="jumpToTeam(msg.msg_team_id)">{{msg.msg_team_name}}</span>
            <span>的组长</span>
          </span>
        </template>

        <template v-else-if="msg.type==5">
          <span style="float: left;">
            <span class="jump-link user-link" @click="jumpToUser(msg.msg_username)">{{msg.msg_username}}</span>
            <span>退出小组</span>
            <span class="jump-link team-link" @click="jumpToTeam(msg.msg_team_id)">{{msg.msg_team_name}}</span>
          </span>
        </template>

        <template v-else-if="msg.type==6">
          <span style="float: left;">
            <span>你申请加入小组</span>
            <span class="jump-link team-link" @click="jumpToTeam(msg.msg_team_id)">{{msg.msg_team_name}}</span>
            <span>被拒绝</span>
          </span>
        </template>

        <template v-else-if="msg.type==10">
          <span style="float: left;">
            <span>你发布的任务</span>
            <span class="jump-link task-link" @click="jumpToTask(msg.msg_task_id)">{{msg.msg_task_title}}</span>
            <span>被</span>
            <span class="jump-link user-link" @click="jumpToUser(msg.msg_username)">{{msg.msg_username}}</span>
            <span>接受</span>
          </span>
        </template>

        <template v-else-if="msg.type==11">
          <span style="float: left;">
            <span>你发布的任务</span>
            <span class="jump-link task-link" @click="jumpToTask(msg.msg_task_id)">{{msg.msg_task_title}}</span>
            <span>被</span>
            <span class="jump-link user-link" @click="jumpToUser(msg.msg_username)">{{msg.msg_username}}</span>
            <span>完成</span>
          </span>
        </template>

        <template v-else-if="msg.type==12">
          <span style="float: left;">
            <span>你发布的任务</span>
            <span class="jump-link task-link" @click="jumpToTask(msg.msg_task_id)">{{msg.msg_task_title}}</span>
            <span>被</span>
            <span class="jump-link user-link" @click="jumpToUser(msg.msg_username)">{{msg.msg_username}}</span>
            <span>取消接受</span>
          </span>
        </template>

        <template v-else-if="msg.type==13">
          <span style="float: left;">
            <span>你完成的任务</span>
            <span class="jump-link task-link" @click="jumpToTask(msg.msg_task_id)">{{msg.msg_task_title}}</span>
            <span>被</span>
            <span class="jump-link user-link" @click="jumpToUser(msg.msg_username)">{{msg.msg_username}}</span>
            <span>确认</span>
          </span>
        </template>

        <Icon @click="deleteMsg(index)" type="ios-close" size="24" class="close-icon" v-if="!joinTeamType.includes(msg.type)"/>
      </li>
    </ul>
    <Button @click="deleteAllMsg" type="error" class="btn-deleteAllMsg">清空消息</Button>
  </div>
</template>


<script>
  export default {
    props: ['message', 'accTeamJoin'],
    data() {
      return {
        joinTeamType: [0, 7]
      }

    },

    mounted() {

    },

    computed: {

    },

    methods: {
      handleTeamJoin(type, teamid, username, index) {
        let accUrl = '/api/v1/' + (type == 0 ? 'team/Member/Invitation' : 'user/teamcancelblack');
        let accData = null;
        if (type == 0) {
          accData = {
            "team_id": teamid,
            "user": [
              {
                "username": username
              }
            ]
          };
        }
        else {
          accData = {
            ins_name: username,
            team_id: teamid
          };
        }

        let rejUrl = '/api/v1/' + (type == 0 ? 'team/Member/Rejection' : 'user/refuseOrgToTeam');
        let rejData = null;
        if (type == 0) {
          rejData = {
            "team_id": teamid,
            "username": username
          };
        }
        else {
          rejData = {
            ins_name: username,
            team_id: teamid
          };
        }

        let url = this.accTeamJoin[index] == 1 ? accUrl : rejUrl;
        let data = this.accTeamJoin[index] == 1 ? accData : rejData;

        this.$axios.post(url, data)
        .then(msg => {
          if (msg.data.code == 200) {
            this.$Message.success(msg.data.msg);
          }
          else {
            this.$Message.error(msg.data.msg);
          }
          this.deleteMsg(index, true);
        })
        .catch(err => {
          this.$Message.error(err.response.data.msg);
          this.deleteMsg(index, true);
        });
      },

      deleteMsg(index, isHandleTeamJoin) {
        this.$axios.delete('/api/v1/toast/Id?id='+ this.message[index].id)
          .then(msg => {
            if (msg.data.code == 200) {
              this.$Message.success(msg.data.msg);
              this.message.splice(index, 1);
              if (isHandleTeamJoin) this.accTeamJoin.splice(index, 1);
            }
            else this.$Message.error(msg.data.msg);
          })
          .catch(err => {
            this.$Message.error(err.response.data.msg);
          });
      },

      deleteAllMsg() {
        this.$axios.delete('/api/v1/toast/Username')
          .then(msg => {
            if (msg.data.code == 200) {
              this.$Message.success(msg.data.msg);
              this.message.splice(0);
            }
            else this.$Message.error(msg.data.msg);
          })
          .catch(err => {
            this.$Message.error(err.response.data.msg);
          });
      },

      jumpToUser(username) {
        this.$router.push({path: `/user/` + username});
      },

      jumpToTeam(teamid) {
        this.$router.push({path: `/MainPage/groupDetail/` + teamid});
      },

      jumpToTask(taskid) {
        this.$router.push({path: `/MainPage/task_detail/` + taskid});
      }

    }
  }


</script>


<style scoped>
  .div-message {
    width: 400px;
    position: absolute;
    left: 5px;
    top: 75px;
    background: #fff;
    border: 1px solid rgb(235, 235, 235);
  }

  .div-message ul {
    max-height: 400px;
    overflow: auto;
  }

  .li-msg {
    list-style: none;
    border-bottom: 1px solid rgb(235, 235, 235);
    padding: 20px;
    line-height: 24px;
    overflow: hidden;
  }

  .li-msg:last-child {
    border-bottom: none;
    margin-bottom: 10px;
  }

  .close-icon {
    vertical-align: top;
    cursor: pointer;
    float: right;
  }

  .user-link {
    color: #ed4014;
  }

  .team-link {
    color: #19be6b;
  }

  .task-link {
    color: #2d8cf0;
  }

  .jump-link {
    cursor: pointer;
  }

  .jump-link:hover {
    text-decoration: underline;
  }

  span {
    display: inline-block;
    max-width: 280px;
    overflow: hidden;
  }

  .btn-deleteAllMsg {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
</style>
