```js
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
const redrectTo = (
  productId: string,
  productUrl: string[],
  data: any,
  resolvedUrl,
  index = 2
) => {
  console.log("redrectTo HIT product/variant");
  let seoName = "";
  let supportUrl = "";

console.log("productUrl", productUrl);
  const indexOfHyphen = productUrl.indexOf("-");
  const productIdwithVariant = productUrl.slice(0, index).join("_");

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
};
export async function getServerSideProps(context) {
  const resolvedUrl = context.resolvedUrl;
  const { data } = await showProduct(false);
  const { productId } = context.params;
  let seoName = "";
  let supportUrl = "";
  const productUrl = productId.join(",")?.replace("-", ",")?.split(",");
  console.log("productUrlABC", productUrl);

  /*
    when  product/variant pattern
  */
  if (!productIdVairant(productId[0])) {

    return redrectTo(productId, productUrl, data, resolvedUrl);
  }
  /*
    when  product_variant pattern
    when  seoName is there and url enter seo name not correct
  */
  if (productIdVairant(productId[0]) && data.seoName !== productUrl[1]) {
    // PO/12 in url
    return redrectTo(productId, productUrl, data, resolvedUrl, 1);

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


```

/*
    Scenario 1
    id/variant
    seo name
/*
let arr = [ 'CP1717', '01', 'support' ]
arr.splice(arr.length-1, 0, 'prestige-oplaadstation');
/*
    Scenario 2
    id_variant
    seo name
*/
let arr = [ 'CP1717_01', 'support' ]
arr.splice(arr.length-1, 0, 'prestige-oplaadstation');
arr = arr.filter(a => a).join("/")
/*
    Scenario 2
    id/variant
    no seo name
*/
/*
    Scenario 2
    id_variant
    no seo name
*/
final url look like
productId_variant(?-seo name)/(?support)



  const router = useRouter();
  console.log("router", router.asPath);

console.log("productUrl", productUrl);
  React.useEffect(() => {
    let seoName = '';
    let supportUrl = '';
    if (isProductIdVairant) {
      const indexOfHyphen = productUrl.indexOf("-");
      const productIdwithVariant = productUrl.slice(0, 2).join("_");

      if (productInfo.seoName) {
        seoName = `-${productInfo.seoName}`;
      }
      if (!productInfo.seoName && indexOfHyphen !== -1) {
        seoName = "";
      }
      if (resolvedUrl.includes("support")) {
        supportUrl = "/support";
      }
      router.push(`${url}/${productIdwithVariant}${seoName}${supportUrl}`);
    }
  }, [isProductIdVairant,productInfo.seoName]);
