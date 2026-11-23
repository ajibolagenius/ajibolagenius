-- Link the Lagos Data School entry to its site.
update public.experience_entries
set company_url = 'https://www.lagosdataschool.com/'
where company = 'Lagos Data School';
