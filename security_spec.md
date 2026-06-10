# Security Specification for 하루운세

## 1. Data Invariants
- **Reservations**:
  - Must be created with a valid topic, valid email, and explicit personal info consent (`agreed == true`).
  - Immutability of key fields: `name`, `gender`, `birthdate`, `birthTime`, `birthPlace`, `topic`, `content`, `phone`, `email`, `agreed`, `createdAt` cannot be altered once created, except by an authorized admin.
  - Non-admins can ONLY create new pending reservations and check their own reservations using their email/phone or an ID, but can never view other users' sensitive consultation records.
  - Action-based adjustments to `paymentStatus` and `status` can only be made by authenticated admins.
  - `resultText` can only be set or modified by authenticated admins.
  - High-precision temporal stamps: `createdAt` must be the server time at submission.
- **Reviews**:
  - Anyone can read reviews (public-facing), but creating them requires valid fields, and only an admin can write replies/answers (`answer` field).
  - Deletion or modification of user reviews is strictly restricted to authenticated admins.

## 2. The "Dirty Dozen" Attack Payloads (Threat Vectors)
Here are 12 specific malicious JSON payloads that our security rules must reject:

1. **Self-Elevated Admin Attempt**
   ```json
   {
     "name": "attacker",
     "isAdmin": true
   }
   ```
2. **Ghost-Field Injection on Reservation Create**
   ```json
   {
     "name": "홍길동",
     "gender": "남성",
     "birthdate": "1990-01-01",
     "topic": "하루진로",
     "email": "hacker@test.com",
     "phone": "010-1234-5678",
     "agreed": true,
     "ghostField": "maliciousValue",
     "paymentStatus": "결제완료"
   }
   ```
3. **Admin Response Hijacking by Anonymous User**
   ```json
   {
     "name": "홍길동",
     "resultText": "해커가 남긴 거짓 사주 풀이 결과입니다."
   }
   ```
4. **Altering Creation Timestamp**
   ```json
   {
     "name": "홍길동",
     "topic": "하루진로",
     "createdAt": "2020-01-01T00:00:00Z"
   }
   ```
5. **Review Hijack: Editing Existing review details**
   ```json
   {
     "name": "기존닉네임",
     "content": "이 사이트는 해킹되었습니다."
   }
   ```
6. **Self-Approving Payment Status**
   ```json
   {
     "topic": "하루궁합",
     "paymentStatus": "결제완료"
   }
   ```
7. **Bypassing Personal Data Consent**
   ```json
   {
     "name": "성명",
     "topic": "하루궁합",
     "email": "test@test.com",
     "agreed": false
   }
   ```
8. **Invalid String ID Poisoning Attack**
   - An ID that is 10KB to trigger memory exhaustion.
9. **Fake Admin Reply Injection on Public Review**
   ```json
   {
     "name": "유저",
     "content": "좋아요!",
     "answer": "관리자 사칭 답변"
   }
   ```
10. **Listing Sensitive Private Reservations**
    - Querying the entire `reservations` list without email restriction or appropriate filters.
11. **Injecting Float ratings out of bounds (e.g. 500)**
    ```json
    {
      "name": "심평원",
      "rating": 500,
      "content": "좋아요",
      "serviceName": "하루진로"
    }
    ```
12. **Tampering with Immutable `createdAt` Field in Reservation Update**
    ```json
    {
      "createdAt": "2026-01-01T00:00:00Z"
    }
    ```

## 3. Rules Strategy
We will implement safe `firestore.rules` checks using standard ABAC, isolating PII, checking schema properties, validating required size limits, and verifying admin status from our database paths (such as checking if the uid is in an authorized list, or using the simple admin password system check if Firebase Auth is not active yet).
