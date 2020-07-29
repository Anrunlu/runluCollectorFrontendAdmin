<template>
  <q-layout>
    <q-page-container>
      <q-page class="q-py-md row justify-center bg-image">
        <q-page-sticky
          class="desktop-only"
          position="top-left"
          :offset="[18, 18]"
        >
          <q-btn
            fab
            icon="arrow_back"
            color="pink"
            @click="$router.replace('/push_notice')"
          />
        </q-page-sticky>
        <q-form class="q-gutter-md">
          <q-btn-toggle
            v-model="notice.type"
            toggle-color="primary"
            :options="msgTypeOpts"
          />
          <q-btn
            class="float-right"
            rounded
            color="primary"
            icon="send"
            label="立即发布"
            @click="sendNotice"
          />
          <q-btn
            class="float-right"
            outline
            rounded
            color="primary"
            icon="save"
            label="保存草稿"
            @click="saveNotice"
          />
          <q-input
            v-model="notice.title"
            type="text"
            label="输入标题"
            :rules="[val => !!val]"
          >
            <template v-slot:prepend>
              <q-icon name="subject" />
            </template>
          </q-input>

          <Editor
            api-key="ryfh70i3ynejw1fqxmt9ov1t0cyypyzu274we3ridakk4fsw"
            v-model="notice.content"
            :init="{
              height: 600,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'image'
              ],
              toolbar:
                'undo redo| fullscreen preview | formatselect | image media | bold italic forecolor backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
            }"
          />
        </q-form>
        <q-dialog v-model="sendNoticeDig" persistent>
          <NoticeSend :id="sendId"></NoticeSend>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";
import NoticeSend from "src/components/NoticeSend";
import { createNotice, getNoticeDetail, updateNotice } from "src/api/notice";
import { date } from "quasar";
export default {
  components: {
    Editor,
    NoticeSend
  },
  props: ["id"],
  data() {
    return {
      indexSearchPanel: "ruleOrg",
      sendNoticeDig: false,
      sendId: "",
      draftId: "",
      notice: {
        type: "announcement",
        status: "draft",
        title: "",
        content: ""
      },
      msgTypeOpts: [
        { label: "公告", value: "announcement" },
        { label: "通知", value: "notice" },
        { label: "广告", value: "ad" },
        { label: "其他", value: "others" }
      ]
    };
  },
  created() {
    if (this.id && this.id !== "new") {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      this.$q.loading.show({
        message: "加载中..."
      });
      if (this.id) {
        const { data } = await getNoticeDetail(this.id);
        this.sendId = this.id;
        this.notice = data;
      } else if (this.draftId) {
        const { data } = await getNoticeDetail(this.draftId);
        this.sendId = this.draftId;
        this.notice = data;
      }
      this.$q.loading.hide();
    },
    async saveNotice() {
      if (this.notice.title == "" || this.notice.content == "") {
        this.$q.notify({
          type: "warning",
          message: "标题或内容不可为空"
        });
        return false;
      }
      if (this.id && this.id !== "new") {
        // 如果传入id值不为new，保存时更新
        await updateNotice(this.id, this.notice);
        this.$q.notify({
          type: "positive",
          message: "更新成功"
        });
      } else if (this.draftId) {
        // 如果draftId，保存时更新
        await updateNotice(this.draftId, this.notice);
        this.$q.notify({
          type: "positive",
          message: "更新成功"
        });
      } else {
        // 如果都不存在，则创建
        this.notice.sender = "5ef3f9a54ff82d0764020c11";
        const { data } = await createNotice(this.notice);
        this.draftId = data._id;
        this.sendId = this.draftId;
        this.$q.notify({
          type: "positive",
          message: "保存成功"
        });
      }
    },
    sendNotice() {
      if (this.draftId || this.id) {
        this.sendNoticeDig = true;
      } else {
        this.$q.notify({
          type: "negative",
          message: "请先保存"
        });
      }
    }
  }
};
</script>
<style scoped>
.bg-image {
  background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
  /* background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); */
  /* background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%); */
}
</style>
