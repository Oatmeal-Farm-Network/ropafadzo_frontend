<!doctype html>
<html lang="en">
  <head>
<meta charset="UTF-8">
<meta name="revisit-after" content="7 Days"/>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

    <meta charset="utf-8">
    <meta name="author" content="Oatmeal AI">
    <!--#Include virtual="/includefiles/globalvariables.asp"-->
    <!--#Include file="SpeciesVariables.asp"-->
<% Title = currentbreed2 & " | " & currentbreed2 & " Stud Services" %>
<title><%=Title %></title>
<meta name="title" content="<%=Title %>"/> 
<link rel="canonical" href="<%=currenturl %>?pagenumber=<%=pagenumber %>" />
<meta name="description" content="<%=CurrentBreed2 %> at <%=WebSiteName %> - <%=CurrentBreed %> ranches, <%=CurrentBreed2 %> Stud Services." />
<meta name="keywords" content="<%=CurrentBreed2 %>,
<%=CurrentBreed2 %> Stud Services,
<%=CurrentBreed %> breeders,
breeding <%=CurrentBreed2 %>" />

<% pagenumber = request.querystring("pagenumber") %>
<% 
Set rs2 = Server.CreateObject("ADODB.Recordset")

currentmaxStudFee= request.form("currentmaxStudFee")
if len(currentmaxStudFee) > 0 then
   currentmaxStudFeeSearch = " and StudFee <  " & currentmaxStudFee & " "
else
 currentmaxStudFeeSearch = ""
end if 

currentminStudFee= request.form("currentminStudFee")

'response.write("currentminStudFee=" & currentminStudFee )
if len(currentminStudFee) > 0 then
   currentminStudFeeSearch = " and StudFee >  " & currentminStudFee & " "
else
 currentminStudFeeSearch = ""
end if 


SortBy= request.querystring("SortBy")
if len(SortBy) > 0 then
else
SortBy = request.form("SortBy")
end if

'response.write("SortBy=" & SortBy )
if SortBy = "StudFee Desc" then
Sortbysearch = " Studfee Desc  "
end if

if SortBy = "StudFee Asc" then
Sortbysearch = " Studfee Asc  "
end if


'*******************************************
' Percent Accoyo
'*******************************************
BreedSortID = request.querystring("BreedSortID")
if len(BreedSortID) > 0 then
else
BreedSortID = request.form("BreedSortID")
end if

BreedSearch = ""

if len(BreedSortID) > 0 then
sql2 = "select Breed from SpeciesBreedLookupTable where BreedLookupID=" & BreedSortID 
'response.write("sql2=" & sql2)
rs2.Open sql2, conn, 3, 3
if not rs2.eof then

BreedSort = rs2("Breed")
BreedSearch = " and BreedID=" & BreedSortID
end if
end if

'*******************************************
' Percent Accoyo
'*******************************************
PercentAccoyo= request.querystring("PercentAccoyo")
if len(PercentAccoyo) > 0 then
else
PercentAccoyo = request.form("PercentAccoyo")
end if


QPercentAccoyo = ""
If PercentAccoyo = "0" Then
QPercentAccoyo = " and (len(Percentaccoyo) < 2 ) "
End If 
If PercentAccoyo = "1/8" Then
datafound = True
QPercentAccoyo = " and ( Percentaccoyo ='1/8' or Percentaccoyo ='1/4' or Percentaccoyo ='3/8' or Percentaccoyo ='1/2' or Percentaccoyo ='5/8'  or Percentaccoyo ='3/4' or Percentaccoyo ='7/8' or Percentaccoyo ='FullAccoyo') "
End If 
If PercentAccoyo = "1/4" Then
datafound = True
QPercentAccoyo = " and ( Percentaccoyo ='1/4' or Percentaccoyo ='3/8' or Percentaccoyo ='1/2' or Percentaccoyo ='5/8'  or Percentaccoyo ='3/4' or Percentaccoyo ='7/8' or Percentaccoyo ='FullAccoyo') "
End If 
If PercentAccoyo = "3/8" Then
datafound = True
QPercentAccoyo = " and ( Percentaccoyo ='3/8' or Percentaccoyo ='1/2' or Percentaccoyo ='5/8'  or Percentaccoyo ='3/4' or Percentaccoyo ='7/8' or Percentaccoyo ='FullAccoyo') "
End If 	
If PercentAccoyo = "1/2" Then
datafound = True
QPercentAccoyo = " and ( Percentaccoyo ='1/2' or Percentaccoyo ='5/8'  or Percentaccoyo ='3/4' or Percentaccoyo ='7/8' or Percentaccoyo ='FullAccoyo') "
End If 	
If PercentAccoyo = "5/8" Then
datafound = True
QPercentAccoyo = " and ( Percentaccoyo ='5/8'  or Percentaccoyo ='3/4' or Percentaccoyo ='7/8' or Percentaccoyo ='FullAccoyo') "
End If 	
If PercentAccoyo = "3/4" Then
QPercentAccoyo = " and ( Percentaccoyo ='3/4' or Percentaccoyo ='7/8' or Percentaccoyo ='FullAccoyo') "
End If 	
If PercentAccoyo = "7/8" Then
datafound = True
QPercentAccoyo = " and ( Percentaccoyo ='7/8' or Percentaccoyo ='FullAccoyo') "
End If 
If PercentAccoyo = "FullAccoyo" Then
datafound = True
QPercentAccoyo = " and ( Percentaccoyo ='FullAccoyo') "
End If 

ColorSort= request.querystring("ColorSort")
if len(ColorSort) > 0 then
else
ColorSort = request.form("ColorSort")
end if

if len(ColorSort) > 3 then
datafound = True
Colorsearch = " and  (Color1 = '" & ColorSort & "' or Color2 = '" & ColorSort & "' or Color3 = '" & ColorSort & "' or Color4 = '" & ColorSort & "' or Color5 = '" & ColorSort & "') "
else
Colorsearch = ""
end if 

OBO = request.form("OBO")
if OBO= "Yes" then
datafound = True
OBOSearch = " and OBO=1 "
else
OBOSearch = ""
end if 
RegistrationID= request.form("RegistrationID")
if len(RegistrationID) > 0 then
datafound = True
RegistrationSearch = " and RegistrationID= " & RegistrationID
else
RegistrationSearch = ""
end if 

MinAge = request.Form("MinAge")
If Len(MinAge) > 0 Then
datafound = True
Session("MinAge") = MinAge
Else
MinAge= Session("MinAge") 
End If 
MaxAge = request.Form("MaxAge")
If Len(MaxAge) > 0 Then
datafound = True
Session("MaxAge") =MaxAge
Else
MaxAge= Session("MaxAge") 
End If 
If Len(MinAge) >  0 and not MinAge = "Any" Then
datafound = True
QMinAge =  MinAge *12  
Else
QMinAge = 0
End If 
QMinAge = ""
If Len(MinAge) >  0 and not MinAge = "Any" Then
datafound = True
QMinAge =  " and datemonths >  " &  MinAge *12  & " "
End If 
If Len(MaxAge) >  0  and not MaxAge = "Any"Then
datafound = True
QMaxAge =  MaxAge *12  
Else
QMaxAge = 10000
End If


Ancestry = trim(request.Form("Ancestry"))
if len(Ancestry) > 0 then
else
Ancestry = trim(request.querystring("Ancestry"))
end if

QAncestry = ""
If Ancestry = "Partial Peruvian" Then
datafound = True
QAncestry = " and len(Percentperuvian) > 1 "
End If 
If Ancestry = "Full Peruvian" Then
datafound = True
QAncestry = " and (Percentperuvian = 'Full Peruvian' or Percentperuvian = 'FullPeruvian') "
End If 
If Ancestry = "Partial Chilean" Then
datafound = True
QAncestry = " and len(PercentChilean) > 1 "
End If 
If Ancestry = "Full Chilean" Then
datafound = True
QAncestry = " and (PercentChilean = 'Full Chilean' or PercentChilean = 'FullChilean')"
End If 
If Ancestry = "Partial Bolivian" Then
QAncestry = " and len(PercentBolivian) > 1 "
End If 
If Ancestry = "Full Bolivian" Then
datafound = True
QAncestry = " and (PercentBolivian = 'Full Bolivian' or PercentBolivian = 'Full Bolivian') "
End If 


Sortby= trim(request.form("Sortby"))

'response.write("SortBy=" & SortBy )
SpeciesCategoryID = request.form("SpeciesCategoryID")
if len(SpeciesCategoryID) > 0 then
else
SpeciesCategoryID = request.querystring("SpeciesCategoryID")
end if


if SortBy = "Color1" then
Sortbysearch = " Color1 Desc, Color2 Desc, Color3 Desc  "
end if  


If not IsNumeric(SpeciesCategoryID) Then
    SpeciesCategoryID = 0
End If


if len(SpeciesCategoryID) > 0 and not SpeciesCategoryID = 10000 then
datafound = True
CategorySearch = " and SpeciesCategoryID= " & SpeciesCategoryID

else
CategorySearch =""
End if

StateIndex= trim(request.form("StateIndex"))
if len(StateIndex) > 0 then
else
StateIndex= trim(request.querystring("StateIndex"))
end if
'response.write("StateIndex=" & StateIndex )

if len(StateIndex) > 0 and not(StateIndex="10000") then
datafound = True
Statesearch = " and address.StateIndex = " & StateIndex & " "
else
Statesearch = ""
end if

Sortby= trim(request.form("Sortby"))
if len(SortBy) > 0 then
else
Sortby= trim(request.querystring("Sortby"))
end if

if SortBy = "Breed" then
Sortbysearch = " BreedID, BreedID2, BreedID3, BreedID4, BreedID5  "
end if

if SortBy = "Name" then
Sortbysearch = " FullName  "
end if



if trim(SortBy) = "Age" then
Sortbysearch = " DOBYear Desc, DOBMonth desc, DOBday desc  "
end if

Orderby= trim(request.form("Orderby"))
if len(Orderby) > 0 then
else
Orderby= trim(request.querystring("Orderby"))
end if


if len(Orderby) > 0 then
else
Orderby= " DESC"
end if


if len(Sortby) > 0 then
'Sortbysearch = " Sort By  '" & Sortby & "' "
else
Sortbysearch = " Lastupdated Desc "
end if



 if len(SpeciesCategoryID) > 1 then
 searchvariables = searchvariables + "&SpeciesCategoryID=" & SpeciesCategoryID
 end if

 if len(BreedSortID) > 0 then
 searchvariables = searchvariables + "&BreedSortID=" & BreedSortID
 end if

if len(ColorSort) > 1 then
 searchvariables = searchvariables + "&ColorSort=" & ColorSort
 end if

 if len(OBOSearch) > 1 then
 searchvariables = searchvariables + "&OBOSearch=" & OBOSearch
 end if

 
 if len(Ancestry) > 1 then
 searchvariables = searchvariables + "&Ancestry=" & Ancestry
 end if

if len(QPercentAccoyo) > 1 then
 searchvariables = searchvariables + "&QPercentAccoyo=" & QPercentAccoyo
 end if

if len(AddressState) > 1 then
 searchvariables = searchvariables + "&AddressState=" & AddressState
end if


if len(SortBy) > 1 then
 searchvariables = searchvariables + "&SortBy=" & SortBy
end if


'if len(OrderBy) > 1 then
' searchvariables = searchvariables + "&OrderBy=" & OrderBy
'end if

%>
</head>
<body >
 <!--#Include virtual="/Header.asp"-->
<div class="container-fluid d-none d-lg-block" id="grad1" align = "center" style=" min-height: 70px" >
    <div class = "row" align = "center" >
        <div class = "col body" >
            <h1>&nbsp;<%=CurrentSpecies %> Stud Services</h1>
        </div>
</div>
</div>
    <div class="container-fluid d-none d-lg-block" align = "center" style=" min-height: 20px" >
    <div class = "row" align = "center" >
        <div class = "col body" >
            <% if ShowStuds = True then %>
            <a href="Studs.asp" class = "whitebody">
               <a href="Default.asp" class = "body"><div align = Right><b><%=CurrentSpecies2 %> For Sale</b><img src = "https://www.Globallivestocksolutions.com/images/px.gif" width = 8 height = 6 /></div></a>
            <% end if %>
            <br />
        </div>
</div>
</div>

<div class="container-fluid d-none d-lg-block" align = "center" >
<div class="row" align = "center">
  <div class="col-3" align = "left" style="min-width: 200px">
  
   <!--#Include virtual="/includefiles/StudsSearchStandardInclude.asp"-->
  </div>
  <div class="col-9" align = "center" style="max-width: 1000px; min-height: 67px">
 

  <!--#Include virtual="/includefiles/StudsDetailInclude.asp"--> 


  
  </div>
</div>
</div>


<% ' XS and SM navigation  %>
<div class="container-fluid d-lg-none " id="grad1" >
   <div class = "row" align = "center" ">
        <div class = "col whitebody">
            <h1><%=CurrentSpecies %> Stud Services</h1>
            <a href="default.asp" class = "whitebody"><div align = right><b><%=CurrentSpecies %> For Sale</b></div></a>
        </div>
</div>
</div>

<div class="container-fluid d-lg-none dropshadow" >

<div class="row" align = "left">
  <div class="col-12" align = "left">
  <br />

 <!--#Include virtual="/includefiles/StudsSearchMobileInclude.asp"-->


  </div>
</div>
<div>
  <div class="col-12" align = "center">
   <br />

 <!--#Include virtual="/includefiles/StudsMobileDetailInclude.asp"--> 

  
  </div>
</div>
</div>

<!--#Include virtual="/Footer.asp"-->

</body>
</html>