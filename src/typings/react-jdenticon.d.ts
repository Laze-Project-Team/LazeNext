declare module 'react-jdenticon' {
  export type JdenticonProps = {
    value: string;
    size: string;
  };

  // eslint-disable-next-line import/no-default-export
  export default Jdenticon as React.ComponentType<JdenticonProps>;
}
