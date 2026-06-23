const win32normalize = (path: string) => path.replace(/\\/g, "/");

export const getProjectName = (workingDir: string | null) => {
  if (workingDir === null) {
    return null;
  }
  return win32normalize(workingDir).split("/").at(-1) ?? null;
};
