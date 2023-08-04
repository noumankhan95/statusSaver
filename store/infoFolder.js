import { createContext, useCallback, useState } from "react";

export const folderPathCtx = createContext({
  path: "",
  setPath: (path) => {},
});

const FolderPathProvider = ({ children }) => {
  const [folderpath, setfolderpath] = useState("");
  const setstatusFolderpath = (p) => {
    console.log("Setting Path", p);
    setfolderpath((c) => p);
  };
  const pathctx = {
    path: folderpath,
    setPath: setstatusFolderpath,
  };
  return (
    <folderPathCtx.Provider value={pathctx}>{children}</folderPathCtx.Provider>
  );
};

export default FolderPathProvider;
