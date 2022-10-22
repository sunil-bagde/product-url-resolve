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

  let seoName = "";
  let supportUrl = "";
  const productUrl = productId.join(",")?.replace("-", ",")?.split(",");

  if (!productIdVairant(productId[0])) {
    // PO/12 in url
    const indexOfHyphen = productUrl.indexOf("-");
    const productIdwithVariant = productUrl.slice(0, 2).join("_");

    console.log("productId if 1", productId);
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
  if (
    productIdVairant(productId[0]) &&
    data.seoName &&
    productUrl.indexOf("-") === -1 &&
    data.seoName !== productUrl[1]
  ) {
    // PO/12 in url

    console.log("productId if 2", productId);
    const productIdwithVariant = productUrl.slice(0, 1).join("_");
    const indexOfHyphen = productUrl.indexOf("-");
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

  const productUrlNew = productUrl.filter(
    (i, index) => index === 0 || i == "support"
  );

  if (!data.seoName && productUrlNew.length ==1 && productUrl.length > 1) {
    if (resolvedUrl.includes("support")) {
      supportUrl = "/support";
    }
    const productIdwithVariant = productUrl.slice(0, 1).join("_");
    return {
      redirect: {
        destination: `${url}/${productIdwithVariant}${supportUrl}`,
        permanent: false,
      },
    };
  }
  if (!data.seoName && productUrlNew.length <= 2 && productUrl.length > 2) {
    console.log("productUrlNew if 3", productUrlNew);
    if (resolvedUrl.includes("support")) {
      supportUrl = "/support";
    }
    const productIdwithVariant = productUrl.slice(0, 1).join("_");
    return {
      redirect: {
        destination: `${url}/${productIdwithVariant}${supportUrl}`,
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
