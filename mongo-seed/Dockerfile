FROM mongo

COPY init.json /init.json
CMD mongoimport --host database --db legit --collection articles --mode upsert --type json --file /init.json --jsonArray