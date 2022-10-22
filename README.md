
https://dev.zaha.philips.com/nl-NL/consumer/product/CP1717_01-prestige-oplaadstation/support
View support for your Oplaadstation CP1717/01 | Philips


seems to work now

but there are some issues in redirect:
https://dev.zaha.philips.com/nl-NL/consumer/product/CP1717_01/support -> would expect redirect to support page with seoname
https://dev.zaha.philips.com/nl-NL/consumer/product/CP1717/01 -> redirect broken
https://dev.zaha.philips.com/nl-NL/consumer/product/CP1717/01/support -> redirect not working (expect seoname)
https://dev.zaha.philips.com/nl-NL/consumer/product/CP1717_01-prestige/support -> redirect expected to move to suport page with correct seoname


and clicking on a recently viewed link seems also to break, %20 is added to url


same for accessories banner: https://dev.zaha.philips.com/nl-NL/consumer/product/HX9911_09-diamondclean-9000-elektrische-sonische-tandenborstel-met-app-zwart


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
