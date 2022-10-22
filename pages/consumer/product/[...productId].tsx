import axios from "axios";

const isContainsUndescore = (id: string) => {
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

  const { data } = await showProduct(false);
  const { productId } = context.params;
  let seoName = "";
  if (!isContainsUndescore(productId[0])) {
    const productUrl = productId.join(",")?.replace("-",",").split(",");
    console.log("productUrl", productUrl);
   /* return {
      props: {},}*/
    const indexOfHyphen = productUrl.indexOf("-");
   const productIdwithVariant = productUrl.slice(0, 2).join("_");
    console.log("productIdwithVariant", productIdwithVariant);
    if (data.seoName) {
      seoName = `-${data.seoName}`;
    }
    if (!data.seoName && indexOfHyphen !== -1) {
      seoName = ``;
    }

    console.log("seoName", seoName);
    return {
      props: {},
      redirect: {
        destination: `${url}/${productIdwithVariant}${seoName}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

function ProductPage() {
  return <div>Welcome to Next.js!</div>;
}

export default ProductPage;
