"use server";

export default async function GetPost(formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries());
  console.log(formDataObject);
}
