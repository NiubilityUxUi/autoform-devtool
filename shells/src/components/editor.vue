<template>
  
    <div ref="jsoneditor"  style="height: 700px;"></div>

</template>

<script>
import JSONEditor from "jsoneditor";

import "jsoneditor/dist/jsoneditor.css";

export default {
  name: "editor",
  props: {
    jsonData: {
      default() {
        return {};
      },
      type: Object
    }
  },
  data() {
    return {
      vJson: this.jsonData
    };
  },

  methods: {
    updateModel(data) {
      if (this.vJson && this.vJson.model) {
        clearTimeout(this.updateTimer);
        this.vJson.model = data;
        this.updateTimer = setTimeout(() => {
          this.__updateJsonContainer(this.vJson);
        }, 200);
      }
    },
    updateFields(data) {
      if (this.vJson && this.vJson.fields) {
        clearTimeout(this.updateFieldsTimer);
        this.vJson.fields = data;
        this.updateFieldsTimer = setTimeout(() => {
          this.__updateJsonContainer(this.vJson);
        }, 200);
      }
    },
    __updateJsonContainer(data) {
      this.editor.set(data);
    },
    __initJsonContainer() {
      let container = this.$refs.jsoneditor;
      if (!container) {
        return;
      }
      let options = {
        mode: "code",
        modes: ["code", "form", "text", "tree", "view"], // allowed modes,
        search: false,
        onChange: () => {
          this.vJson = this.editor.get();
          this.$emit("upVal", this.vJson);
        },
        onError: e => {
          console.log(e);
        }
      };

      this.editor = new JSONEditor(container, options, this.jsonData);
    }
  },
  mounted() {
    this.__initJsonContainer();
  }
};
</script>
