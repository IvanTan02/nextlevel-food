import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { S3 } from '@aws-sdk/client-s3';

const db = sql('meals.db');

const s3 = new S3({
  region: 'ap-southeast-2'
});

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error('Failed to get meals.');
  return db.prepare(`SELECT * FROM meals`).all();
}

export function getMeal(slug) {
  return db.prepare(`SELECT * FROM meals WHERE slug = ?`).get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const imageExtension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${imageExtension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  s3.putObject({
    Bucket: 'next-level-foodie-app',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type
  })

  meal.image = fileName;

  db.prepare(`
    INSERT OR IGNORE INTO meals 
    (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)
  `).run(meal);
}