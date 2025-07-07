const useTenantColorScheme = () => {
  return {
    primary: "#FF0420",
    primaryRGB: "rgba(255, 4, 32, 1)",
    gradient: {
      startColor: "(255, 4, 32, 0.6)",
      endcolor: "#FFFFFF",
    },
    uniswap: {
      primary: "#FF007A",
      primaryRGB: "rgba(255, 0, 122, 1)",
      gradient: {
        startColor: "rgba(255, 0, 122, 0.6)",
        endcolor: "#FFFFFF",
      },
    },
    newdao: {
      primary: "#EDCCA2",
      primaryRGB: "rgba(237, 204, 162, 1)",
      gradient: {
        startColor: "rgba(237, 204, 162, 0.6)",
        endcolor: "#FFFFFF",
      },
    },
  };
};

export default useTenantColorScheme;
