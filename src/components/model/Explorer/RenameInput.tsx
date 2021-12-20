import type { VFC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { TreeItem } from 'react-complex-tree';
import { useTree, useTreeEnvironment } from 'react-complex-tree';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { explorerSlice } from '@/features/redux/explorer';
import { store } from '@/features/redux/root';
import { cx } from '@/features/utils/cx';
import { getBase, getName } from '@/features/utils/path';

type RenameInputProps = {
  inputRef: React.Ref<HTMLInputElement>;
  item: TreeItem;
};

export const RenameInput: VFC<RenameInputProps> = ({ inputRef, item }) => {
  const [t] = useTranslation('editor');
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const tree = document.querySelector('div[role="tree"][data-rct-tree="directory-view"]');

  useEffect(() => {
    const current = (inputRef as React.RefObject<HTMLInputElement> | null)?.current;

    if (current) {
      current.focus();
      current.select();
      setTop(current.getBoundingClientRect().top - (tree?.getBoundingClientRect()?.top ?? 0) + current.clientHeight);
      setLeft(current.getBoundingClientRect().left - (tree?.getBoundingClientRect()?.left ?? 0));
    }
  }, [inputRef, tree]);

  const environment = useTreeEnvironment();
  const { treeInformation, setRenamingItem, treeId } = useTree();
  const directoryState = store.getState().explorer.directory;
  const dispatcher = useDispatch();
  const { deleteDirent } = explorerSlice.actions;
  const [title, setTitle] = useState(environment.getItemTitle(item));
  const [warn, setWarn] = useState<string | false>(false);

  const abort = useCallback(() => {
    environment.onAbortRenamingItem?.(item, treeInformation.treeId);
    setRenamingItem(null);
    requestAnimationFrame(() => {
      environment.setActiveTree(treeId);
    });

    if ((item.index as string).endsWith('/')) {
      dispatcher(deleteDirent({ path: item.index as string }));
    }
  }, [deleteDirent, dispatcher, environment, item, setRenamingItem, treeId, treeInformation.treeId]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        abort();
      }
    },
    [abort]
  );

  const confirm = useCallback(() => {
    environment.onRenameItem?.(item, title, treeInformation.treeId);
    setRenamingItem(null);
    requestAnimationFrame(() => {
      environment.setActiveTree(treeId);
    });
  }, [environment, item, setRenamingItem, title, treeId, treeInformation.treeId]);

  const validate = useCallback(
    (name: string) => {
      if (name.length === 0) {
        setWarn('A file or folder name must be provided.');

        return false;
      }

      if (Object.keys(directoryState).includes(`${getBase(item.index as string)}/${name}`)) {
        setWarn('A file or folder with that name already exists. Please choose a different name.');

        return false;
      }

      if (name.endsWith('.')) {
        setWarn('This name is not valid as a file or folder name. Please choose a different name.');

        return false;
      }

      setWarn(false);

      return true;
    },
    [directoryState, item.index]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      validate(event.target.value);
    },
    [validate]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (validate(title)) {
        confirm();
      }
    },
    [confirm, title, validate]
  );

  const submit = useCallback(() => {
    if (validate(title)) {
      confirm();
    } else {
      abort();
    }
  }, [abort, confirm, title, validate]);

  return (
    <>
      <form onSubmit={handleSubmit} className="rct-tree-item-renaming-form relative">
        <input
          onChange={handleChange}
          value={title}
          ref={inputRef}
          onBlur={() => {
            return void submit();
          }}
          onKeyDown={handleKeyDown}
          aria-label={getName(item.index as string)}
          tabIndex={0}
          className={cx(
            'rct-tree-item-renaming-input bg-none',
            warn && '!border-[1px] !border-[#be1100] !border-solid'
          )}
        />
        {warn &&
          tree &&
          ReactDOM.createPortal(
            <div
              className="absolute z-20 text-xs p-[0.1rem] text-[#ccc] bg-[#5a1d1d] border-[1px] border-[#be1100]"
              style={{
                top: `${top}px`,
                left: `${left}px`,
              }}
            >
              {t(warn)}
            </div>,
            tree
          )}
      </form>
    </>
  );
};
