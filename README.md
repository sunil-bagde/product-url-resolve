```js
import * as React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  isProductIdVairant,
  getProductVairant,
  productRedirectTo,
  productSeoName,
  showProduct,
  getSupportUrl,
} from "utils";

let url = "/consumer/product";

export async function getServerSideProps(context) {
  const resolvedUrl = context.resolvedUrl;
  const { data } = await showProduct(false);
  const { productId } = context.params;
  let seoName = "";
  let supportUrl = "";
  const productUrl = productId.join(",")?.replace("-", ",")?.split(",");

  if (!isProductIdVairant(productId[0])) {
    // PO/12 in url
    console.log("productId if 1", productId);
    const productIdwithVariant = getProductVairant(productUrl, 2);
    seoName = productSeoName(data.seoName, productUrl);
    supportUrl = getSupportUrl(resolvedUrl);
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }
  if (
    isProductIdVairant(productId[0]) &&
    data.seoName &&
    data.seoName !== productUrl[1]
  ) {
    // PO/12 in url
    console.log("productId if 2", productId);
    const productIdwithVariant = getProductVairant(productUrl, 1);
    seoName = productSeoName(data.seoName, productUrl);
    supportUrl = getSupportUrl(resolvedUrl);
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }

  const productUrlNew = productUrl.filter(
    (i, index) => index === 0 || i == "support"
  );

/*  if (!data.seoName && productUrlNew.length == 1 && productUrl.length > 1) {
    supportUrl = getSupportUrl(resolvedUrl);
    const productIdwithVariant = getProductVairant(productUrl, 1)
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }*/

console.log("productUrlNew", productUrlNew);

console.log("productUrl", productUrl);
  if (!data.seoName && productUrlNew.length <  productUrl.length  ) {
   // if (!data.seoName && productUrlNew.length <= 2 && productUrl.length > 2) {
    console.log("productUrlNew if 3", productUrlNew);
    supportUrl = getSupportUrl(resolvedUrl);
    const productIdwithVariant = getProductVairant(productUrl, 1)
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }

  return {
    props: {
      resolvedUrl: resolvedUrl,
      productUrl: productUrl,
      isProductIdVairant: isProductIdVairant(productId[0]),
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
```

```
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
```
