-- Link the Bema Integrated Services entry to its live product.
update public.experience_entries
set company_url = 'https://app.bemahub.com'
where company = 'Bema Integrated Services';
