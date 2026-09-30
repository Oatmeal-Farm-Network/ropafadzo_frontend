<!DOCTYPE html>
<html xmlns="https://www.w3.org/1999/xhtml">
<head>
<!--#Include virtual="/includefiles/GlobalVariables.asp"-->

<% 

speciesID = request.querystring("speciesID")
BreedlookupID = request.querystring("BreedlookupID")
Set rs2 = Server.CreateObject("ADODB.Recordset")
sql2 = "select * from SpeciesAvailable where SpeciesID =" & SpeciesID 
rs2.Open sql2, conn, 3, 3
if not rs2.eof then 
SpeciesName = rs2("SingularTerm") 
SpeciesNamePlural = rs2("PluralTerm") 
end if
rs2.close

response.redirect("https://www.livestockoftheworld.com/" & SpeciesNamePlural   & "/") 

sql2 = "select * from SpeciesBreedLookupTable where BreedlookupID =" & BreedlookupID  & " Order by trim(Breed)"
rs2.Open sql2, conn, 3, 3
if not rs2.eof then 
Breed = rs2("Breed") 
BreedID = rs2("BreedLookupID") 
BreedlookupID = rs2("BreedlookupID")
Breeddescription= rs2("Breeddescription")
BreedImage= rs2("BreedImage")
Breedvideo= rs2("Breedvideo")
BreedImageOrientation = rs2("BreedImageOrientation")
BreedImageCaption = rs2("BreedImageCaption")
end if
rs2.close
%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en-us"/>
<title>About <%= trim(Breed) %>&nbsp;<%=SpeciesNamePlural  %></title>
<meta name="Title" content="About <%= trim(Breed) %>&nbsp;<%=SpeciesNamePlural  %>"/>
<meta name="Description" content="About <%= trim(Breed) %>&nbsp;<%=SpeciesNamePlural  %>. <%=left(Breeddescription,100) %>"> 
<meta name="robots" content="follow"/>
<meta name="rating" content="Safe for kids"/>
<meta name="Googlebot" content="follow"/>
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
</HEAD>

<body >

</body>
</html>