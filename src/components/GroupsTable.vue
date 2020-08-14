<template>
  <div>
    <q-table
      title="群组管理"
      :data="data"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <q-btn outline color="primary" icon="people" label="群组管理" />
          <!-- <q-btn
            outline
            color="positive"
            icon="group_add"
            label="添加群组"
            @click="handleAddGroup"
          /> -->
        </div>
      </template>

      <template v-slot:top-right="props">
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="页内搜索"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"
          }}</q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon-right="archive"
          label="导出"
          no-caps
          @click="exportTable"
        />
      </template>

      <template v-slot:body-cell-orgname="props">
        <q-td :props="props">
          <q-chip dense outline icon="school" color="primary">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-chip square dense outline icon="people" color="accent">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          <q-chip dense square outline icon="insert_invitation" color="primary">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-creator="props">
        <q-td :props="props">
          <q-chip square dense outline>
            <q-avatar size="xs">
              <img :src="props.row.creator.avatar" />
            </q-avatar>
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="edit"
              @click="handleCurrGroupDetail(props.row)"
              ><q-tooltip>
                修改信息
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="delete_outline"
              @click="handleDeleteGroup(props.row)"
            >
              <q-tooltip>
                删除群组
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data="">
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <span class="text-h6">
            暂无数据
          </span>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="groupDetailDig">
      <q-card class="card-bg text-black">
        <q-card-section class="text-h6 ">
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            v-close-popup
          ></q-btn>
          <div class="text-h6">群组详情</div>
          <div class="text-subtitle2">查看或编辑群组信息</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currGroupDetails._id"
                  label="ID"
                  disable
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currGroupDetails.name"
                  label="名称"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currGroupDetails.creator.nickname"
                  label="创建者"
                  disable
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-capitalize bg-info text-black"
            @click="handleUpdateGroupInfo"
            >保存</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addGroupDig">
      <q-card class="card-bg text-black">
        <q-card-section class="text-h6 ">
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            v-close-popup
          ></q-btn>
          <div class="text-h6">新建群组</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currGroupDetails.name"
                  label="名称"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currGroupDetails.creator.nickname"
                  label="创建者"
                  disable
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-capitalize bg-info text-black"
            @click="handleUpdateGroupInfo"
            >保存</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { updateGroup, deleteGroup } from "src/api/group";
import { exportFile } from "quasar";
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}
export default {
  name: "GroupsTable",
  props: ["data"],
  data() {
    return {
      filter: "",
      groupDetailDig: false,
      addGroupDig: false,
      currGroupDetails: {
        org: {},
        creator: {}
      },
      columns: [
        {
          name: "orgname",
          label: "组织",
          align: "left",
          field: row => row.org.name,
          sortable: true
        },
        {
          name: "name",
          label: "组名",
          align: "left",
          field: "name",
          sortable: true
        },
        {
          name: "creator",
          align: "left",
          label: "创建者",
          field: row => row.creator.nickname,
          sortable: true
        },
        {
          name: "action",
          align: "center",
          label: "操作"
        }
      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  methods: {
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("groups.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },
    async handleUpdateGroupInfo() {
      let updateGroupDto = {};
      updateGroupDto.name = this.currGroupDetails.name;
      await updateGroup(this.currGroupDetails._id, updateGroupDto);
      this.$q.notify({
        type: "positive",
        message: "更新成功"
      });
    },
    async handleDeleteGroup(group) {
      this.$q
        .dialog({
          title: "请确认",
          message: `删除群组 ${group.name}，操作不可恢复！`,
          ok: {
            label: "删除",
            push: true
          },
          cancel: {
            label: "取消",
            push: true,
            color: "negative"
          },
          persistent: true
        })
        .onOk(async () => {
          await deleteGroup(group._id);
          // 删除本地数据
          this.data.splice(
            this.data.findIndex(item => item._id === group._id),
            1
          );
          this.$q.notify({
            message: "删除成功",
            color: "positive",
            icon: "done",
            position: "center",
            timeout: 1000
          });
        })
        .onCancel(() => {
          this.$q.notify({
            message: "操作取消",
            color: "warning",
            position: "center",
            timeout: 1000
          });
        });
    },
    handleCurrGroupDetail(val) {
      this.groupDetailDig = true;
      this.currGroupDetails = val;
    },
    handleAddGroup() {
      this.addGroupDig = true;
    }
  }
};
</script>
