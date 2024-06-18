<<<<<<<<<<<<<<  ✨ Codeium Command 🌟 >>>>>>>>>>>>>>>>
+/**
+ * Function to check if two strings are anagrams.
+ * @param {string} str1 - The first string.
+ * @param {string} str2 - The second string.
+ * @returns {boolean} - True if the strings are anagrams, false otherwise.
+ */
-//function for check check anagram
 function checkAnagram(str1, str2) {
+    // Check if the lengths of the strings are different
     if (str1.length !== str2.length) {
         return false;
     }
+    
+    // Create an object to store the count of characters in the first string
     let obj = {};
+    
+    // Iterate over the characters of the first string
     for (let i = 0; i < str1.length; i++) {
+        // If the character is already in the object, increment its count
         if (obj[str1[i]]) {
             obj[str1[i]] += 1;
         } else {
+            // If the character is not in the object, add it with count 1
             obj[str1[i]] = 1;
         }
     }
+    
+    // Iterate over the characters of the second string
     for (let i = 0; i < str2.length; i++) {
+        // If the character is in the object, decrement its count
         if (obj[str2[i]]) {
             obj[str2[i]] -= 1;
         } else {
+            // If the character is not in the object, the strings are not anagrams
             return false;
         }
     }
+    
+    // If all characters have been processed and the counts are zero, the strings are anagrams
     return true;
 }
<<<<<<<  f138a263-820d-45b5-81c1-cf9cdba0bdce  >>>>>>>