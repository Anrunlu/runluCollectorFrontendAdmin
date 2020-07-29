<template>
  <div>
    <q-card>
      <q-card-section style="width:350px">
        <q-option-group
          v-model="indexSearchPanel"
          inline
          :options="[
            { label: '按组织', value: 'ruleOrg' },
            { label: '按用户', value: 'ruleUser' }
          ]"
        />

        <q-tab-panels v-model="indexSearchPanel">
          <q-tab-panel name="ruleOrg">
            <q-form class="q-gutter-md">
              <q-select
                v-model="currOrg"
                :options="orgsOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                hide-bottom-space
                :rules="[val => !!val || '请输入组织']"
                label="选择组织*"
                filled
              />
              <q-select
                v-model="currGroup"
                :options="groupsOptions"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                label="选择群组"
                hint="默认为全部群组"
                filled
              >
                <template v-slot:append>
                  <q-icon
                    name="close"
                    @click.stop="currGroup = ''"
                    class="cursor-pointer"
                  /> </template
              ></q-select>
            </q-form>
          </q-tab-panel>

          <q-tab-panel name="ruleUser">
            <q-form class="q-gutter-md">
              <q-input
                v-model="currEmail"
                label="输入邮箱"
                type="email"
                filled
                :rules="[checkUser]"
                :hint="findUserHit"
              />
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="发布" color="primary" @click="sendNotice" v-close-popup />
        <q-btn flat label="取消" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </div>
</template>
<script>
import { getOrgList } from "src/api/org";
import { getGroupList } from "src/api/group";
import { findUsers } from "src/api/user";
import { createNotice, updateNotice, deleteNotice } from "src/api/notice";
export default {
  name: "NoticeSend",
  props: ["id"],
  data() {
    return {
      indexSearchPanel: "ruleOrg",
      sendNoticeDig: false,
      currOrg: "",
      currGroup: "",
      currEmail: "",
      findUserHit: "请输入邮箱",
      currUser: {},
      orgsOptions: [],
      groupsOptions: [],
      notice: {}
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    currOrg: function() {
      this.getGroupOpts();
    }
  },
  methods: {
    async fetch() {
      this.$q.loading.show({
        message: "加载中..."
      });
      const { data } = await getOrgList({ type: "query" });
      this.orgsOptions = data;
      this.$q.loading.hide();
    },
    async getGroupOpts() {
      const { data } = await getGroupList({
        type: "query",
        orgId: this.currOrg
      });
      this.groupsOptions = data;
    },
    async sendNotice() {
      this.notice.status = 'published'
      if (this.indexSearchPanel === "ruleUser") {
        this.notice.receivertype = "User";
        this.notice.receiver = this.currUser._id;
      }
      if (this.indexSearchPanel === "ruleOrg") {
        if (this.currGroup) {
          this.notice.receivertype = "Group";
          this.notice.receiver = this.currGroup;
        } else {
          this.notice.receivertype = "Org";
          this.notice.receiver = this.currOrg;
        }
      }
      await updateNotice(this.id, this.notice);
      this.$q.notify({
        type: "positive",
        message: "发布成功"
      });
    },
    checkUser(val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          findUsers({ org: "none", email: val }).then(res => {
            if (res.data[0]) {
              this.currUser = res.data[0];
              this.findUserHit = `姓名：${this.currUser.nickname}`;
              resolve(true);
            } else {
              this.currUser = {};
              this.findUserHit = "请输入邮箱";
              resolve("用户不存在");
            }
          });
        }, 1000);
      });
    }
  }
};
</script>
