// Από chatGPT
// https://chatgpt.com/c/68973f23-2d48-832e-aa26-b288589df5b6



// Παράδειγμα χρήσης;
// await lazySave(
//   db.collection('Calendars').doc(AppUser.id),
//   calendarData,
//   { merge: false }
// );


function lazySave(ref, data, options) {
  return new Promise((resolve, reject) => {
    const key = ref.path || ref.id || JSON.stringify(ref);

    // Αν υπάρχει ήδη timer, τον ακυρώνουμε
    if (lazySave.queue.has(key)) {
      clearTimeout(lazySave.queue.get(key).timer);
    }

    // Ορίζουμε νέο timer για αποθήκευση
    const timer = setTimeout(async () => {
      try {
        await ref.set(data, options);
        lazySave.queue.delete(key);
        resolve();
      } catch (err) {
        lazySave.queue.delete(key);
        reject(err);
      }
    }, lazySave.timeout);

    // Αποθηκεύουμε στην ουρά
    lazySave.queue.set(key, { timer });
  });
}

// Default properties (ο χρήστης μπορεί να τα αλλάξει αν θέλει)
lazySave.timeout = 1500;
lazySave.queue = new Map();

