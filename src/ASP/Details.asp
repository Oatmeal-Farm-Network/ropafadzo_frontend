<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
 <!--#Include virtual="/includefiles/globalvariables.asp"-->
 <% 
ID= Request.QueryString("ID") 
'if len(ID) > 0 then
'else
'Response.AddHeader "Location","https://www.LivestockofAmerica.com/"
'end if 

sql = "select People.PeopleID, animals.FullName, animals.speciesid, Description, Photo1 from People, animals, photos where animals.ID=Photos.ID and People.PeopleID= animals.PeopleID and animals.id = " & ID
'response.write("sql=" & sql)
rs.Open sql, conn, 3, 3
if not rs.eof then
Photo1 = rs("Photo1")
CurrentPeopleID = rs("PeopleID")
Name = trim(rs("FullName"))
Description = Trim(Description)
if len(Description) > 1 then
For y=1 to Len(Description)
spec = Mid(Description, y, 1)
specchar = ASC(spec)
if specchar < 32 or specchar > 126 then
Description= Replace(Description,  spec, " ")
end if
Next
end if
str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
Description= Replace(str1, "''", "'")
End If


if len(Name) > 1 then
For y=1 to Len(Name)
spec = Mid(Name, y, 1)
specchar = ASC(spec)
if specchar < 32 or specchar > 126 then
Name= Replace(Name,  spec, " ")
end if
Next
end if
str1 = Name
str2 = "''"
If InStr(str1,str2) > 0 Then
Name= Replace(str1, "''", "'")
End If
CurrentanimalName = Name
SpeciesID = rs("speciesID")

if SpeciesID = 2 then
signularanimal = "Alpaca"
pluralanimal = "Alpacas"
end if 
if SpeciesID = 3 then
signularanimal = "Dog"
pluralanimal = "Alpacas"
end if 
if SpeciesID = 4 then
signularanimal = "Llama"
     pluralanimal = "Llamas"
end if 
if SpeciesID = 5 then
signularanimal = "Horse"
     pluralanimal = "Horses"
end if 
if SpeciesID = 6 then
signularanimal = "Goat"
     pluralanimal = "Goats"
end if 
if SpeciesID = 7 then
signularanimal = "Donkey"
     pluralanimal = "Donkeys"
end if 
if SpeciesID = 8 then
signularanimal = "Cattle"
     pluralanimal = "Cattle"
end if 
if SpeciesID = 9 then
signularanimal = "Bison"
     pluralanimal = "Bison"
end if 
if SpeciesID = 10 then 
signularanimal = "Sheep"
     pluralanimal = "Sheep"
end if 
if SpeciesID = 11 then
signularanimal = "Rabbit"
     pluralanimal = "Rabbits"
end if 
if SpeciesID = 12 then
signularanimal = "Pig"
     pluralanimal = "Pigs"
end if 
if SpeciesID = 13 then
signularanimal = "Chicken"
     pluralanimal = "Chickens"
end if 
if SpeciesID = 14 then
signularanimal = "Turkey"
     pluralanimal = "Turkeys"
end if 
if SpeciesID = 15 then
signularanimal = "Duck"
     pluralanimal = "Ducks"
end if 

if SpeciesID = 17 then
signularanimal = "Yak"
     pluralanimal = "Yaks"
end if 

if SpeciesID = 18 then
signularanimal = "Camel"
     pluralanimal = "Camels"
end if 
if SpeciesID = 19 then
signularanimal = "Emu"
     pluralanimal = "Emus"
end if 
if SpeciesID = 21 then
signularanimal = "Deer"
     pluralanimal = "Deer"
end if 
if SpeciesID = 22 then
signularanimal = "Geese"
     pluralanimal = "Geese"
end if 
if SpeciesID = 23 then
signularanimal = "Bees"
     pluralanimal = "Bees"
end if 
if SpeciesID = 25 then
signularanimal = "Alligator"
     pluralanimal = "Alligators"
end if 
if SpeciesID = 26 then
signularanimal = "Guinea Fowl"
     pluralanimal = "GuineaFowl"
end if 
if SpeciesID = 27 then
signularanimal = "Musk Ox"
     pluralanimal = "MuskOx"
end if 
if SpeciesID = 28 then
signularanimal = "Ostriche"
     pluralanimal = "Ostriches"
end if 
if SpeciesID = 29 then
signularanimal = "Pheasant"
     pluralanimal = "Pheasants"
end if 
if SpeciesID = 30 then
signularanimal = "Pigeon"
     pluralanimal = "Pigeons"
end if 
if SpeciesID = 31 then
signularanimal = "Quail"
     pluralanimal = "Quails"
end if 
if SpeciesID = 33 then
signularanimal = "Snails"
     pluralanimal = "Snails"
end if 
if SpeciesID = 34 then
signularanimal = "Buffalo"
     pluralanimal = "Buffalo"
end if 


else
end if 
rs.close




if len(CurrentPeopleID) > 0 then
else
response.Redirect("/Default.asp")
end if
sql = "select  * from People where PeopleID= " & CurrentPeopleID
rs.Open sql, conn, 3, 3
If not rs.eof then
BusinessID   = rs("BusinessID")
AddressID  = rs("AddressID")
Logo = rs("Logo")
end if 
rs.close
sql = "select  BusinessName from Business where BusinessID= " & BusinessID
rs.Open sql, conn, 3, 3
If not rs.eof then
BusinessName = rs("BusinessName")
end if 
rs.close
sql = "select  * from Address where AddressID= " & AddressID
rs.Open sql, conn, 3, 3
If not rs.eof then
AddressCity = rs("AddressCity")
AddressState = rs("AddressState")
end if 
rs.close
if len(AddressState) > 1 then
sql = "SELECT * from States where StateAbbreviation =  '" & AddressState & "'"
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql, conn, 3, 3   
if not rs2.eof then
StateName = trim(rs2("StateName"))
end if
rs2.close
end if
 %>

<meta property="og:image" content="<%=Photo1 %>" />
<title><%=Name%> at <%= BusinessName %> - <%=signularanimal %> For Sale</title>
<meta name="Title" content="<%=Name%> - <%= BusinessName %>"/>
<meta name="description" content="<%=left(description, 160)%>[&hellip;]" />
<meta name="robots" content="index, follow"/>
<meta name="rating" content="Safe for kids"/>
<meta name="revisit-after" content="1 day"/>
<meta name="Googlebot" content="index, follow"/>
<meta name="robots" content="All"/>
<meta name="subject" content="<%=signularanimal %> For Sale" />

<meta property="og:locale" content="en_US" />
<meta property="og:type" content="article" />
<meta property="og:title" content="<%=Name%> at <%= BusinessName %> - <%=signularanimal %> For Sale" />
<meta property="og:description" content="<%=left(Description, 160)%>" />
<meta property="og:url" content="<%=currenturl %>?BreedLookupID=<%=BreedID %>&SpeciesID=<%=SpeciesID %>" />
<meta property="og:site_name" content="<%=WebSiteName %>" />

<meta property="og:image:width" content="600" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:description" content="<%=left(description, 160)%>[&hellip;]" />
<meta name="twitter:title" content="<%=Name%> at <%= BusinessName %> - <%=signularanimal %> For Sale" />


<script src="https://www.globallivestocksolutions.com/js/jquery-1.8.2.min.js"></script>
<script src="https://www.globallivestocksolutions.com/js/zoomsl-3.0.min.js"></script>	
    						
<script>
    jQuery(function () {
        if (!$.fn.imagezoomsl) {

            $('.msg').show();
            return;
        }
        else $('.msg').hide();

        $('.my-foto').imagezoomsl({

            innerzoommagnifier: true,
            classmagnifier: window.external ? window.navigator.vendor === 'Yandex' ? "" : 'round-loope' : "",
            magnifierborder: "5px solid #F0F0F0",
            zoomrange: [2, 3],
            zoomstart: 2,
            magnifiersize: [200, 200]
        });
    });
</script>

<style>
.round-loope{
   border-radius: 175px;
   border: 5px solid #F0F0F0;
}
</style>

<%Set rs = Server.CreateObject("ADODB.Recordset")
Set rs2 = Server.CreateObject("ADODB.Recordset")
Set rs3 = Server.CreateObject("ADODB.Recordset")
dim RegistrationType(100)
dim RegistrationNumber(100)

sql = "select  People.* from People where People.PeopleID= " & CurrentPeopleID
rs.Open sql, conn, 3, 3
If not rs.eof then
WebLink = rs("WebLink")
PeopleFirstName = rs("PeopleFirstName")
PeopleMiddleInitial  = rs("PeopleMiddleInitial")
PeopleLastName= rs("PeopleLastName")
rs.close
End If 

viewstud = request.querystring("viewstud")
%>
    </head>
<body >
<link rel="canonical" href="<%=currenturl %>?ID=<%=ID %>" />
<% dim buttonimages(20)
dim buttontitle(20) %>
<!--#Include file="DetailDBInclude.asp"--> 
<% current = "Livestock" 
Current3 = "Animals" 
   %>
      
        <!--#Include virtual="/Animals/AlpacaEPDFindPercentsInclude.asp"-->


 <!--#Include virtual="/Header.asp"-->

<div class="container-fluid d-none d-lg-block" id="grad1" align = "center" style=" min-height: 80px" >
    <div class = "row" align = "center" >
        <div class = "col body" >
            <h1>&nbsp;&nbsp;&nbsp;&nbsp;<%=CurrentanimalName%></h1>

            <br />
        </div>
</div>
</div>

<div class="container d-none d-lg-block" align = "center" style="max-width: 1400px">
    <div class="row" align = "left">
      <div class = "col body">
         <% if Show1percentemblem = True then %>
            <a href="#EPD"><img src = "/images/TopEPD.gif" alt="<%=CurrentanimalName%> EPD" width = 50  align = center border = 0 /></a>
         <% end if %>
      </div>
    </div>
   <div class="row" align = "left">
      <div class = "col-9 body">
      <!--#Include file="GeneralStatsInclude.asp"-->
      </div>
      <div class = "col-3 body" style = "min-width:325; max-width:325" >
        
            <!--#Include virtual="/includefiles/DetailedAnimalImagesinclude.asp"-->
      </div>
    </div>
  <div class="row" align = "left">
      <div class = "col-12 body">
    <% if len(Financeterms) > 6 then %>
        <br />
        <b>Financial Terms</b><br>
        <%=Financeterms %><br>
    <% end if %>
    <!--#Include file="ServiceSireInclude.asp"-->
     <!--#Include file="AwardsInclude.asp"-->
    <!--#Include file="FiberInclude.asp"--> 
    <!--#Include file="ProgenyInclude.asp"--> 
    <!--#Include file="AncestryInclude.asp"-->
    <br> 
    <% if len(Lastupdated) > 0 then %>
        <font class = body color = "#777777">Last Updated: <%=formatdatetime(Lastupdated, 2) %></font><br>
    <% end if %>

    </div>
 </div>
</div>
<div class="container d-lg-none">
  <div class = "row" align = "center">
        <div class = "col body">
            <h2><big><%=CurrentanimalName%></big></h2>
        </div>
    </div>
    <div class="row" align = "left">
      <div class = "col body">
         <% if Show1percentemblem = True then %>
            <a href="#EPD"><img src = "/images/TopEPD.gif" alt="<%=CurrentanimalName%> EPD" width = 50  align = center border = 0 /></a>
         <% end if %>
      </div>
    </div>
    <div class="row" align = "left">
      <div class = "col-9 body" style = "min-width:325; max-width:325" >
          <!--#Include file="DetailDBInclude.asp"--> 
            <!--#Include virtual="/includefiles/DetailedAnimalImagesinclude.asp"-->
      </div>
       <div class = "col-3 body"  >

      </div>
    </div>

   <div class="row" align = "left">
      <div class = "col body">
      <!--#Include file="GeneralStatsInclude.asp"-->
      </div>
    </div>
  <div class="row" align = "left">
      <div class = "col-12 body">
    <% if len(Financeterms) > 6 then %>
        <br />
        <b>Financial Terms</b><br>
        <%=Financeterms %><br>
    <% end if %>
    <!--#Include file="ServiceSireInclude.asp"-->
     <!--#Include file="AwardsInclude.asp"-->
    <!--#Include file="FiberInclude.asp"--> 
    <!--#Include file="ProgenyInclude.asp"--> 
    <!--#Include file="AncestryInclude.asp"-->
    <br> 
    <% if len(Lastupdated) > 0 then %>
        <font class = body color = "#777777">Last Updated: <%=formatdatetime(Lastupdated, 2) %></font><br>
    <% end if %>

    </div>
    </div>
</div>





<!--#Include virtual="/Footer.asp"--> 
</body>
</html>