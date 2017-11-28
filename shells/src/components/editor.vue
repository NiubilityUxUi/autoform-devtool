<template>
  
    <div ref="jsoneditor"  style="height: 700px;"></div>

</template>

<script>
import JSONEditor from "jsoneditor";

import "jsoneditor/dist/jsoneditor.css";

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
      if (this.jsonData && this.jsonData.model) {
        clearTimeout(this.updateTimer);
        this.jsonData.model = data;
        this.updateTimer = setTimeout(() => {
          this.__updateJsonContainer(this.jsonData);
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
      this.editor = new JSONEditor(container, options, this.jsonData);
    }
  },
  mounted() {
    this.__initJsonContainer();
  }
};
</script>
