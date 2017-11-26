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
    // Options: {
    //   defaut() {

    //   },
    //   type: Object
    // }
  },
  data() {
    return {
      vJson: this.jsonData
    };
  },
  mounted() {
    let options = {
      mode: "code",
      modes: ["code", "form", "text", "tree", "view"], // allowed modes,
      search: false,
      onChange: () => {
        this.vJson = this.editor.get();
        this.$emit("upVal", this.vJson);
      },
      onError:(e)=>{
        console.log(e)
      }
    };
    let container = this.$refs.jsoneditor;
    this.editor = new JSONEditor(container, options, this.jsonData);
  }
};
</script>
