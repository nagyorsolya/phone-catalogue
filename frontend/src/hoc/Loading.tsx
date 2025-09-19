export const withLoading = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    if (props.loading) {
      return (
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100">
          <div className="spinner"></div>
        </div>
      );
    }
    return <Component {...props} />;
  };
};
