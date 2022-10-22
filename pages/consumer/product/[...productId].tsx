import * as React from "react";
import axios from "axios";
import { useRouter } from "next/router";

const productIdVairant = (id: string) => {
  return id.includes("_");
};
const showProduct = async (hasName: boolean) => {
  if (!hasName) {
    return { data: {} };
  }
  return await axios.get("http://localhost:3000/api/show-product");
};
let url = "/consumer/product";

export async function getServerSideProps(context) {
  const resolvedUrl = context.resolvedUrl;
  const { data } = await showProduct(true);
  const { productId } = context.params;
  console.log("productId", productId);
  let seoName = "";
  let supportUrl = "";
  const productUrl = productId.join(",")?.replace("-", ",")?.split(",");
  console.log("productUrl", productUrl);
  if (!productIdVairant(productId[0])) {
    // PO/12 in url

    const indexOfHyphen = productUrl.indexOf("-");
    const productIdwithVariant = productUrl.slice(0, 2).join("_");

    if (data.seoName) {
      seoName = `-${data.seoName}`;
    }
    if (!data.seoName && indexOfHyphen !== -1) {
      seoName = "";
    }
    if (resolvedUrl.includes("support")) {
      supportUrl = "/support";
    }
    return {
      redirect: {
        destination: `${url}/${productIdwithVariant}${seoName}${supportUrl}`,
        permanent: false,
      },
    };
  }
  console.log( data.seoName , productUrl[1]);
  if (productIdVairant(productId[0]) &&  data.seoName !== productUrl[1]) {
    // PO/12 in url

    const indexOfHyphen = productUrl.indexOf("-");
    const productIdwithVariant = productUrl.slice(0, 2).join("_");

    if (data.seoName) {
      seoName = `-${data.seoName}`;
    }
    if (!data.seoName && indexOfHyphen !== -1) {
      seoName = "";
    }
    if (resolvedUrl.includes("support")) {
      supportUrl = "/support";
    }
    return {
      redirect: {
        destination: `${url}/${productIdwithVariant}${seoName}${supportUrl}`,
       permanent: false,
      },
    };
  }

  return {
    props: {
      resolvedUrl: resolvedUrl,
      productUrl: productUrl,
      isProductIdVairant: productIdVairant(productId[0]),
      productInfo: data,
      isSupport: resolvedUrl.includes("support"),
    },
  };
}

function ProductPage({
  productUrl,
  isProductIdVairant,
  isSupport,
  productInfo,
  resolvedUrl,
}) {

  return <div>{isSupport ? "Support Page" : "Product Page"}</div>;
}

export default ProductPage;
