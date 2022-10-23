import axios from "axios";

export const isProductIdVairant = (id: string) => {
  return id.includes("_");
};
export const getProductVairant = (productUrl, index = 2) => {
  return productUrl.slice(0, index).join("_");
};
export const getSupportUrl = (resolvedUrl) => {
  const supportText = "support";
  if (resolvedUrl.includes(supportText)) {
    return "/" + supportText;
  }
  return "";
};

export const productRedirectTo = ({
  url,
  productIdwithVariant,
  seoName,
  supportUrl,
}) => {
  return {
    redirect: {
      destination: `${url}/${productIdwithVariant}${seoName}${supportUrl}`,
      permanent: false,
    },
  };
};
export const productSeoName = (seoName = "", productUrl) => {
  const indexOfHyphen = productUrl.indexOf("-");
  let newSeoName = seoName;
  if (newSeoName) {
    newSeoName = `-${newSeoName}`;
  }
  if (!newSeoName && indexOfHyphen !== -1) {
    newSeoName = "";
  }
  return newSeoName;
};
export const showProduct = async (hasName: boolean) => {
  if (!hasName) {
    return { data: {} };
  }
  return await axios.get("http://localhost:3000/api/show-product");
};
