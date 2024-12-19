create table recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image text,
  url text,
  description text,
  prep_time text,
  cook_time text,
  total_time text,
  yield text,
  category text,
  cuisine text,
  keywords text,
  instructions json,
  ingredients json,
  nutrition json,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
);

alter table recipes
add constraint check_metadata check (
  json_matches_schema(
    '{
          "type": "array",
          "items": {
            "@type": "string",
            "name": "string",
            "text": "string",
            "url": "string",
            "image": "string"
          }
    }',
    recipeInstructions
  )
);

alter table recipes
add constraint check_metadata check (
  json_matches_schema(
    '{
          "type": "array",
          "items": {
            "type": "string"
          }
    }',
    recipeIngredients
  )
);
