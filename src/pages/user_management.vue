<template>
  <q-page class="q-pa-sm">
    <q-tabs
      v-model="tab"
      inline-label
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="edit" icon="person" label="管理用户" />
      <q-tab name="add" icon="person_add" label="导入用户" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" class="bg-transparent">
      <q-tab-panel name="add">
        <UserCreate></UserCreate>
      </q-tab-panel>

      <q-tab-panel name="edit">
        <div class="row q-gutter-sm justify-evenly">
          <div class="col col-md-8 col-12">
            <UsersTable :data="data"></UsersTable>
          </div>
          <div class="col col-md-3 col-12">
            <q-option-group
              v-model="indexSearchPanel"
              inline
              :options="[
                { label: '按组织', value: 'ruleOrg' },
                { label: '按邮箱', value: 'ruleEmail' },
                { label: '全部', value: 'ruleAll' }
              ]"
            />

            <q-tab-panels
              v-model="indexSearchPanel"
              class="shadow-2 rounded-borders"
            >
              <q-tab-panel name="ruleOrg">
                <q-form @submit="onFindSubmit('byOrg')" class="q-gutter-md">
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
                  />
                  <q-input
                    v-model="currUsername"
                    type="text"
                    label="输入学(工)号"
                    hint="默认返回以上全部用户"
                    filled
                  />
                  <div>
                    <q-btn
                      label="查找"
                      type="submit"
                      icon="search"
                      color="primary"
                    />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="ruleEmail">
                <q-form @submit="onFindSubmit('byEmail')" class="q-gutter-md">
                  <q-input
                    v-model="currEmail"
                    label="输入邮箱"
                    type="email"
                    filled
                  />
                  <div>
                    <q-btn
                      label="查找"
                      type="submit"
                      icon="search"
                      color="primary"
                    />
                  </div>
                </q-form>
              </q-tab-panel>

              <q-tab-panel name="ruleAll">
                <q-btn
                  color="primary"
                  icon="search"
                  label="显示全部"
                  @click="onFindSubmit('all')"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { findUsers, updateUser, deleteUser } from "src/api/user";
import { getOrgList } from "src/api/org";
import { getGroupList } from "src/api/group";
import UsersTable from "src/components/UsersTable";
import UserCreate from "src/components/UserCreate";
import { exportFile } from "quasar";

export default {
  components: {
    UsersTable,
    UserCreate
  },
  data() {
    return {
      tab: "edit",
      indexSearchPanel: "ruleOrg",
      currOrg: "",
      currGroup: "",
      currUsername: "",
      currEmail: "",
      orgsOptions: [],
      groupsOptions: [],
      data: [],
      pagination: {
        rowsPerPage: 10
      }
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
    async onFindSubmit(type) {
      this.$q.loading.show({
        message: "加载中..."
      });
      if (type === "all") {
        const { data } = await findUsers({
          org: "all",
          group: "all",
          username: "none"
        });
        this.data = data;
      } else if (type === "byEmail") {
        const { data } = await findUsers({
          org: "none",
          group: "none",
          email: this.currEmail
        });
        this.data = data;
      } else if (type === "byOrg") {
        const { data } = await findUsers({
          org: this.currOrg,
          group: this.currGroup,
          username: this.currUsername
        });
        this.data = data;
      }
      this.$q.loading.hide();
    }
  }
};
</script>
