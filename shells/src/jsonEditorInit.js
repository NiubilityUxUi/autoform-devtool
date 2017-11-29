import Vue from 'vue';

import editor from './components/editor';


let instance = null;


export default function (e, win) {
    if (e.type === 'init') {
        if (instance) {
            instance.$destroy();
        }
        instance = new Vue({
            el: '#app',
            render(h) {
                const self = this;
                return h('div', {
                    attrs: {
                        id: 'app',
                    }
                }, [
                    h(editor, {
                        ref: 'editorRef',
                        props: {
                            jsonData: e.data,
                        },
                        on: {
                            upVal(val) {
                                //  
                                win.postMessage({
                                    type: 'devtool-data-update',
                                    data: val
                                }, '*');
                            }
                        }
                    })
                ]);
            },
            methods: {
                updateModel(data) {
                    this.$refs.editorRef.updateModel(data);
                },
                updateFields(data){
                    this.$refs.editorRef.updateFields(data);
                }
            },
            component: {
                editor
            }
        });

    } else if (e.type === 'autoform_update_model') {
        instance.updateModel(e.data.model);
    } else if (e.type === 'autoform_update_fields') {
        instance.updateFields(e.data.fields);
    }
}