REVOKE ALL ON FUNCTION public.handle_seller_application_approved() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_seller_application_approved() FROM anon;
REVOKE ALL ON FUNCTION public.handle_seller_application_approved() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.handle_seller_application_approved() TO service_role;