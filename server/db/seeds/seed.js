import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcrypt';
import { pool } from '../index.js';

const __filename = fileURLToPath(import.meta.url);

const YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  '6th Year',
  'Résidanat - Biologie',
  'Résidanat - Médecine',
  'Résidanat - Chirurgie'
];

const MODULES = [
  // 1st Year
  ['1st Year', 'Anatomy', '🫀'],
  ['1st Year', 'Embryology', '👶'],
  ['1st Year', 'Histology', '🔬'],
  ['1st Year', 'Cytology', '🧫'],
  ['1st Year', 'Biochemistry', '🧪'],
  ['1st Year', 'Physiology', '💓'],
  ['1st Year', 'Biophysics', '🩻'],
  ['1st Year', 'Biostatistics', '📊'],
  ['1st Year', 'Chemistry', '⚗️'],
  ['1st Year', 'First Aid', '🚑'],
  ['1st Year', 'SSH', '⏳'],
  ['1st Year', 'Computer Science', '💻'],
  ['1st Year', 'TD/TP Sheets', '📄'],
  // 2nd Year
  ['2nd Year', 'Génétique', '🧬'],
  ['2nd Year', 'Immunologie', '🛡️'],
  ['2nd Year', 'Unité 1 – Appareil Cardio-Respiratoire', '❤️🫁'],
  ['2nd Year', 'Unité 2 – Appareil Digestif', '🍽️'],
  ['2nd Year', 'Unité 3 – Appareil Urinaire', '💧'],
  ['2nd Year', 'Unité 4 – Appareil Endocrino-Génital', '🦋'],
  ['2nd Year', 'Unité 5 – Appareil Neuro-sensoriel', '🧠'],
  // 3rd Year
  ['3rd Year', 'Anapath (Anatomie pathologique)', '🔬'],
  ['3rd Year', 'Immuno (Immunologie)', '🛡️'],
  ['3rd Year', 'Microbio (Microbiologie)', '🦠'],
  ['3rd Year', 'Parasito (Parasitologie)', '🪱'],
  ['3rd Year', 'Pharmaco (Pharmacologie)', '💊'],
  ['3rd Year', 'U1 / Cardio-Respiratoire', '🫁'],
  ['3rd Year', 'U2 / Neuro-Sensoriel', '🧠'],
  ['3rd Year', 'U3 / Endocrino-Génital', '🦋'],
  ['3rd Year', 'U4 / Digestif', '🍽️'],
  // 4th Year
  ['4th Year', 'GASTROLOGY', '🍽️'],
  ['4th Year', 'PNEUMOLOGY', '🫁'],
  ['4th Year', 'NEUROLOGY', '🧠'],
  ['4th Year', 'CARDIOLOGY', '❤️'],
  ['4th Year', 'INFECTIOLOGY', '🦠'],
  ['4th Year', 'HEMATO-ONCOLOGY', '🩸'],
  // 5th Year
  ['5th Year', 'PEDIATRICS', '👶'],
  ['5th Year', 'GYNECOLOGY', '🤰'],
  ['5th Year', 'TRAUMATOLOGY', '🦴'],
  ['5th Year', 'ENDOCRINOLOGY', '🦋'],
  ['5th Year', 'MENTAL HEALTH', '🧠'],
  ['5th Year', 'UROLOGY', '🚻'],
  // 6th Year
  ['6th Year', "Médecine d'urgence", '🚑'],
  ['6th Year', 'Médecine du travail', '🏭'],
  ['6th Year', 'Médecine légale', '⚖️'],
  ['6th Year', 'Épidémiologie', '📈'],
  ['6th Year', 'Dermatologie', '🧴'],
  ['6th Year', 'ORL', '👂'],
  ['6th Year', 'Ophtalmologie', '👁️'],
  ['6th Year', 'Maladies systémiques', '🦋'],
  // Résidanat - Biologie
  ['Résidanat - Biologie', 'Anatomie pathologique', '🔬'],
  ['Résidanat - Biologie', 'Cytologie', '🧫'],
  ['Résidanat - Biologie', 'Génétique', '🧬'],
  ['Résidanat - Biologie', 'Physiologie rénale', '💧'],
  ['Résidanat - Biologie', 'Biochimie', '🧪'],
  ['Résidanat - Biologie', 'Embryologie', '👶'],
  ['Résidanat - Biologie', 'Appareil cardiovasculaire', '❤️'],
  ['Résidanat - Biologie', 'Physiologie respiratoire', '🫁'],
  ['Résidanat - Biologie', 'Endocrinologie', '🦋'],
  ['Résidanat - Biologie', 'Appareil digestif', '🍽️'],
  ['Résidanat - Biologie', 'Appareil génital', '🚻'],
  ['Résidanat - Biologie', 'Hémobiologie', '🩸'],
  ['Résidanat - Biologie', 'Immunologie', '🛡️'],
  ['Résidanat - Biologie', 'Microbiologie', '🦠'],
  ['Résidanat - Biologie', 'Neurophysiologie', '🧠'],
  ['Résidanat - Biologie', 'Tissus musculaires', '💪'],
  ['Résidanat - Biologie', 'Radiologie', '🩻'],
  // Résidanat - Médecine
  ['Résidanat - Médecine', 'Cardiologie', '❤️'],
  ['Résidanat - Médecine', 'Dermatologie', '🧴'],
  ['Résidanat - Médecine', 'Endocrinologie', '🦋'],
  ['Résidanat - Médecine', 'Gastro-entérologie (Médecine)', '🍽️'],
  ['Résidanat - Médecine', 'Gastro-entérologie (Chirurgie)', '🔪'],
  ['Résidanat - Médecine', 'Hématologie', '🩸'],
  ['Résidanat - Médecine', 'Infectiologie', '🦠'],
  ['Résidanat - Médecine', 'Maladies systémiques', '🦋'],
  ['Résidanat - Médecine', 'Rhumatologie', '🦴'],
  ['Résidanat - Médecine', 'Néphrologie', '💧'],
  ['Résidanat - Médecine', 'Neurologie', '🧠'],
  ['Résidanat - Médecine', 'Pédiatrie', '👶'],
  ['Résidanat - Médecine', 'Pneumologie', '🫁'],
  ['Résidanat - Médecine', 'Psychiatrie', '🧠'],
  ['Résidanat - Médecine', "Médecine d'urgence", '🚑'],
  ['Résidanat - Médecine', 'Thérapeutique', '💊'],
  ['Résidanat - Médecine', 'Médecine légale', '⚖️'],
  ['Résidanat - Médecine', 'Médecine du travail', '🏭'],
  ['Résidanat - Médecine', 'Épidémiologie', '📈'],
  // Résidanat - Chirurgie
  ['Résidanat - Chirurgie', 'CCI', '🏥'],
  ['Résidanat - Chirurgie', 'Gynécologie', '🤰'],
  ['Résidanat - Chirurgie', 'Neurochirurgie', '🧠'],
  ['Résidanat - Chirurgie', 'Ophtalmologie', '👁️'],
  ['Résidanat - Chirurgie', 'ORL', '👂'],
  ['Résidanat - Chirurgie', 'Traumatologie', '🦴'],
  ['Résidanat - Chirurgie', 'Urologie', '🚻']
];

export async function runSeed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Seed academic years
    for (let i = 0; i < YEARS.length; i++) {
      await client.query(
        `INSERT INTO years (name, display_order)
         VALUES ($1, $2)
         ON CONFLICT (name) DO NOTHING;`,
        [YEARS[i], i + 1]
      );
    }

    const yearsRes = await client.query('SELECT id, name FROM years;');
    const yearMap = new Map(yearsRes.rows.map((r) => [r.name, r.id]));

    // 2. Seed all 92 modules
    for (const [yearName, modName, icon] of MODULES) {
      await client.query(
        `INSERT INTO modules (year_id, name, icon)
         VALUES ($1, $2, $3)
         ON CONFLICT (year_id, name) DO NOTHING;`,
        [yearMap.get(yearName), modName, icon]
      );
    }

    // 3. Seed 1 admin + 2 test student users
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mednova.local';
    const adminPass = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const adminHash = await bcrypt.hash(adminPass, 10);
    const studentHash = await bcrypt.hash('Student123!', 10);
    const firstYearId = yearMap.get('1st Year');

    await client.query(
      `INSERT INTO users (name, email, password_hash, year_id, role, status, email_verified)
       VALUES ($1, $2, $3, $4, 'admin', 'approved', TRUE)
       ON CONFLICT (email) DO NOTHING;`,
      ['Mednova Admin', adminEmail, adminHash, firstYearId]
    );

    await client.query(
      `INSERT INTO users (name, email, password_hash, year_id, role, status, email_verified)
       VALUES
         ('Test Student 1', 'student1@mednova.local', $1, $2, 'student', 'approved', TRUE),
         ('Test Student 2', 'student2@mednova.local', $1, $2, 'student', 'pending', TRUE)
       ON CONFLICT (email) DO NOTHING;`,
      [studentHash, firstYearId]
    );

    const adminRow = await client.query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1;',
      [adminEmail]
    );
    const adminId = adminRow.rows[0].id;

    // 4. Seed sample lectures & starter QCM for Anatomy
    const anatomyRow = await client.query(
      "SELECT id FROM modules WHERE name = 'Anatomy' LIMIT 1;"
    );
    const anatomyId = anatomyRow.rows[0]?.id;

    if (anatomyId) {
      const lecCount = await client.query(
        'SELECT COUNT(*)::int AS cnt FROM lectures WHERE module_id = $1;',
        [anatomyId]
      );
      if (lecCount.rows[0].cnt === 0) {
        const lecRes = await client.query(
          `INSERT INTO lectures (module_id, name, display_order)
           VALUES
             ($1, 'Introduction to Human Anatomy', 1),
             ($1, 'Osteology of the Upper Limb', 2)
           RETURNING id;`,
          [anatomyId]
        );
        const firstLectureId = lecRes.rows[0].id;

        await client.query(
          `INSERT INTO course_materials (lecture_id, title, pdf_url)
           VALUES ($1, 'Lecture 1 Slides (Sample)', '/uploads/sample-anatomy-intro.pdf');`,
          [firstLectureId]
        );

        const srcRes = await client.query(
          `INSERT INTO sources (module_id, lecture_id, name, mode, question_count)
           VALUES ($1, $2, 'Anatomy Intro Sample QCM', 'quiz', 1)
           RETURNING id;`,
          [anatomyId, firstLectureId]
        );
        const sourceId = srcRes.rows[0].id;

        const qRes = await client.query(
          `INSERT INTO questions (source_id, question_text, explanation, display_order)
           VALUES ($1, 'Which plane divides the body into anterior and posterior parts?', 'The coronal (frontal) plane separates anterior from posterior.', 1)
           RETURNING id;`,
          [sourceId]
        );
        const questionId = qRes.rows[0].id;

        await client.query(
          `INSERT INTO options (question_id, option_letter, option_text, is_correct)
           VALUES
             ($1, 'A', 'Sagittal plane', FALSE),
             ($1, 'B', 'Coronal (frontal) plane', TRUE),
             ($1, 'C', 'Transverse plane', FALSE),
             ($1, 'D', 'Oblique plane', FALSE);`,
          [questionId]
        );
      }
    }

    // 5. Seed starter announcements
    const annCount = await client.query('SELECT COUNT(*)::int AS cnt FROM announcements;');
    if (annCount.rows[0].cnt === 0) {
      await client.query(
        `INSERT INTO announcements (title, preview, body, category, created_by)
         VALUES
           ('Welcome to Mednova', 'Platform is live...', 'Explore courses, QCMs, flashcards, and contextual discussion threads.', 'Update', $1),
           ('New Anatomy Content', 'Check out the new lectures...', 'Sample 1st Year Anatomy lectures and QCMs are ready.', 'New Content', $1);`,
        [adminId]
      );
    }

    // 6. Seed starter MedSwap item
    const swapCount = await client.query('SELECT COUNT(*)::int AS cnt FROM medswap_items;');
    if (swapCount.rows[0].cnt === 0 && anatomyId) {
      await client.query(
        `INSERT INTO medswap_items (user_id, module_id, title, type, item_condition, description)
         VALUES ($1, $2, 'Netter Atlas of Human Anatomy', 'Book', 'Like New', 'Hardcover, 7th Edition.');`,
        [adminId, anatomyId]
      );
    }

    await client.query('COMMIT');
    console.log('Supabase PostgreSQL seed data applied successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  runSeed()
    .then(() => pool.end())
    .then(() => process.exit(0))
    .catch(() => {
      pool.end().finally(() => process.exit(1));
    });
}
