import type { BeforeMount, OnMount } from '@monaco-editor/react';
import MonacoEditor from '@monaco-editor/react';
import type { VFC } from 'react';
import { useMemo } from 'react';
import { connect } from 'react-redux';

import { Loading } from '@/components/model/MonacoEditor/Loading';
import { initializeMonaco } from '@/features/monaco';
import { options } from '@/features/monaco/option';
import type { RootState } from '@/features/redux/root';

type EditorProps = {
  code: string;
};

const SiderEditor: VFC<EditorProps> = ({ code }) => {
  const onMount: OnMount = (editor) => {
    editor.focus();
    editor.addAction({
      id: 'save-file',
      label: 'save',
      // Ctrl+S
      keybindings: [2097],
      contextMenuOrder: 1.5,
      run: () => {
        return void 0;
      },
    });
  };

  const beforeMount: BeforeMount = (monaco) => {
    initializeMonaco(monaco);
  };

  const currentTheme = useMemo(() => {
    return 'laze-dark';
  }, []);

  return (
    <>
      <MonacoEditor
        value={code}
        language="laze"
        options={options}
        beforeMount={beforeMount}
        onMount={onMount}
        keepCurrentModel
        theme={currentTheme}
        loading={<Loading />}
      />
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    state: state.compete,
  };
};

export const Editor = connect(mapStateToProps)(SiderEditor);
