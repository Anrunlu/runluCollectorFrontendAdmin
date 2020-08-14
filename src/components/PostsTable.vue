<template>
  <div>
    <q-table
      title="文件管理"
      :data="data"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :pagination.sync="pagination"
    >
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

      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <q-btn outline color="primary" icon="folder" label="文件管理" />
        </div>
      </template>

      <template v-slot:body-cell-orgname="props">
        <q-td :props="props">
          <q-chip dense outline icon="school" color="primary">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-origname="props">
        <q-td :props="props">
          <q-chip
            square
            dense
            outline
            icon="insert_drive_file"
            color="secondary"
          >
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
          <q-chip v-if="props.row.creator" square dense outline>
            <q-avatar size="xs">
              <img :src="props.value.avatar" />
            </q-avatar>
            {{ props.value.nickname }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-desclt="props">
        <q-td :props="props">
          <q-chip
            outline
            dense
            :color="props.value ? 'primary' : 'red'"
            :icon="props.value ? 'topic' : 'error'"
            :label="props.value ? props.value.title : '已被撤销'"
          />
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
              @click="handleCurrPostDetail(props.row)"
              ><q-tooltip>
                修改信息
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="get_app"
              @click="downloadFile(props.row)"
              ><q-tooltip>
                下载
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="clear"
              @click="handleDeletePost(props.row)"
            >
              <q-tooltip>
                删除文件
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
    <q-dialog v-model="postDetailDig">
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
          <div class="text-h6">文件详情</div>
          <div class="text-subtitle2">查看或编辑文件信息</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currPostDetails._id"
                  label="ID"
                  disable
                />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currPostDetails.origname"
                  label="文件标题"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currPostDetails.fileUrl"
                  label="文件URL"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-capitalize bg-info text-black"
            @click="handleUpdatePostInfo"
            >保存</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { updatePost, deletePost } from "src/api/post";
import { deleteSgFile } from "src/api/qiniu";
import { saveAs } from "file-saver";
import { exportFile, date } from "quasar";
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}
export default {
  name: "UsersTable",
  props: ["data"],
  data() {
    return {
      filter: "",
      postDetailDig: false,
      currPostDetails: {},
      columns: [
        {
          name: "orgname",
          label: "组织",
          align: "left",
          field: row => row.org.name,
          sortable: true
        },
        {
          name: "origname",
          label: "原文件名",
          align: "center",
          field: "origname",
          sortable: true
        },
        {
          name: "createdAt",
          label: "创建时间",
          align: "left",
          field: "createdAt",
          format: (val, row) => date.formatDate(val, "MM/DD HH:mm"),
          sortable: true
        },
        {
          name: "creator",
          align: "left",
          label: "创建者",
          field: row => row.creator,
          sortable: true
        },
        {
          name: "desclt",
          align: "center",
          label: "收集",
          field: row => row.desclt,
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

      const status = exportFile("customer-management.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },
    downloadFile(postInfo) {
      saveAs(postInfo.fileUrl, postInfo.origname);
    },
    async handleUpdatePostInfo() {
      let updatePostDto = {};
      updatePostDto.title = this.currPostDetails.title;
      updatePostDto.fileUrl = this.currPostDetails.fileUrl;
      await updatePost(this.currPostDetails._id, updatePostDto);
      this.$q.notify({
        type: "positive",
        message: "更新成功"
      });
    },
    async handleDeletePost(post) {
      this.$q
        .dialog({
          title: "请确认",
          message: `删除文件 ${post.origname}，操作不可恢复！`,
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
          // 从七牛云存储删除
          const filekey = post.fileUrl.split("/").pop();
          await deleteSgFile(filekey);
          // 同步删除数据库记录
          await deletePost(post._id);
          // 删除本地数据
          this.data.splice(
            this.data.findIndex(item => item._id == post._id),
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
    handleCurrPostDetail(val) {
      this.postDetailDig = true;
      this.currPostDetails = val;
    }
  }
};
</script>
