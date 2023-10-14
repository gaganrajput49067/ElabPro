import React, { useState } from "react";
import { CKEditor } from "ckeditor4-react";
import { useEffect } from "react";

const TextEditor = ({ value, setValue, EditTable, setEditTable }) => {
  const [editor, setEditor] = useState(null);
  const [edit, setEdit] = useState(true);

  const onBeforeLoad = (e) => {
    setEditor(e.editor);
  };

  useEffect(() => {
    if (editor && edit) {
      editor.setData(value);
    }
  }, [value]);

  useEffect(() => {
    if (editor && EditTable) {
      editor.setData(value);
    }
  }, [value]);

  const onChange = (evt) => {
    setEdit(false);
    setEditTable(false);
    var newContent = evt.editor.getData();
    setValue(newContent);
  };

  return (
    <CKEditor initData={value} onChange={onChange} onLoaded={onBeforeLoad} />
  );
};

export default TextEditor;
