<% inpackage = false
sqlD = "select package.PackageName, package.packageID, Package.PackagePrice from packageanimals, package where packageanimals.PackageID= package.PackageID and packageanimals.AnimalID = " & ID & " "
'response.Write("sqlD=" & sqlD)

Set rsD = Server.CreateObject("ADODB.Recordset")
rsD.Open sqld, conn, 3, 3 
if not rsD.eof then 
inpackage = True
inpackage = True
PackageName = rsD("PackageName")
PackagePrice = rsD("PackagePrice")
PackageID = rsD("PackageID")
PackageLink="/ranches/RanchPackageDetails.asp?packageid=" & PackageID & "&CurrentPeopleid=" & PeopleID & "&TotalPrice=" & PackagePrice

end if
rsD.close

sqlD = "select * from AuctionDutch  where len(AuctionStartDateDay)> 0 and len(AuctionStartDateMonth)> 0 and len(AuctionStartDateYear)> 0 and ( AnimalID1 = " & ID & " or AnimalID2 = " & ID & " or AnimalID3 = " & ID & " or AnimalID4 = " & ID & " or AnimalID5 = " & ID & " or AnimalID6 = " & ID & " )"
'response.Write("sqlD=" & sqlD)
rsD.Open sqld, conn, 3, 3 
 if not rsD.eof then 
startdate = rsD("AuctionStartDateMonth") & "/" & rsD("AuctionStartDateDay") & "/" & rsD("AuctionStartDateYear")
if len(startdate) > 7 then
 stopx = true
if datediff("d",  startdate, now) > -1  and datediff("w",  startdate, now) < 7  then
AnimalID1= rsD("AnimalID1")
AnimalID2= rsD("AnimalID2")
AnimalID3= rsD("AnimalID3")
AnimalID4= rsD("AnimalID4")
AnimalID5= rsD("AnimalID5")
AnimalID6= rsD("AnimalID6")
  
if cint(AnimalID1) = cint(ID) then
Ceiling = rsD("Animal1Ceiling")
Floor = rsD("Animal1Floor")
end if

 AuctionDutchID=   rsD("AuctionDutchID")
AuctionDutchTitle =   rsD("AuctionDutchTitle")
currentPeopleID = rsD("PeopleID")
AuctionLevel =   rsD("AuctionLevel")
AnimalID1array =  rsD("AnimalID1")
AnimalID2array =  rsD("AnimalID2")
AnimalID3array =  rsD("AnimalID3")
AnimalID4array =  rsD("AnimalID4")
AnimalID5array =  rsD("AnimalID5")
AnimalID6array =  rsD("AnimalID6")
AuctionName = rsD("AuctionDutchTitle")
AuctionDescription = rsD("AuctionDutchDescription")
AuctionLevel = rsD("AuctionLevel")
Animal1ceiling= rsD("Animal1ceiling")
Animal2ceiling= rsD("Animal2ceiling")
Animal3ceiling= rsD("Animal3ceiling")
Animal4ceiling= rsD("Animal4ceiling")
Animal5ceiling= rsD("Animal5ceiling")
Animal6ceiling= rsD("Animal6ceiling")
Animal1Floor= rsD("Animal1Floor")
Animal2Floor= rsD("Animal2Floor")
Animal3Floor= rsD("Animal3Floor")
Animal4Floor= rsD("Animal4Floor")
Animal5Floor= rsD("Animal5Floor")
Animal6Floor= rsD("Animal6Floor")
AnimalID1 = rsD("AnimalID1")
AnimalID2 = rsD("AnimalID2")
AnimalID3 = rsD("AnimalID3")
AnimalID4 = rsD("AnimalID4")
AnimalID5 = rsD("AnimalID5")
AnimalID6 = rsD("AnimalID6")
AuctionStartDateday = rsD("AuctionStartDateDay")
AuctionStartDateMonth = rsD("AuctionStartDateMonth")
AuctionStartDateYear = rsD("AuctionStartDateYear")
StartDate = AuctionStartDateMonth & "/" & AuctionStartDateday & "/" & AuctionStartDateYear

if len(Ceiling) > 0 and len(Floor) > -1 then
'  if DateDiff("d", startdate, now) < 8 then
 '   Preview = true
  '  CurrentPrice =ceiling
  'else
  ' auctionstartdate = dateadd("d",7 , startdate)
      auctionstartdate = startdate
      Rate = formatcurrency((Ceiling-Floor) / 50400,3)
TimePast = DateDiff("s", auctionstartdate, now) / 60
CurrentPrice = ceiling - (Rate * TimePast) 
  'end if
end if

dutchauction = True
end if
end if
end if
if len(trim(FullPrice)) > 0 then
FullPrice = cLng(FullPrice)
end if
	If Discount > 1 Then
		DiscountPrice = FullPrice - fullprice*(discount/100)
	Else
		DiscountPrice = FullPrice
	End If 
    

    
    
 if len(DOBMonth) > 0  then
if DOBMonth = "0" then
 DOBMonth = ""
end if
end if

if len(DOBDay) > 0  then
if DOBDay = "0" then
 DOBDay = ""
end if
end if

if len(DOBYear) > 0  then
if DOBYear = "0" then
 DOBYear = ""
end if
end if   
    
TempCurrentBreed = CurrentBreed
if SpeciesID = 4 then 
breedtitle = "Type"
 else 
breedtitle = "Breed"
 end if 
Set rsb = Server.CreateObject("ADODB.Recordset")
if len(BreedID)> 0 then 
sqlb = "select * from SpeciesBreedLookupTable where BreedLookupID=" & BreedID 
rsb.Open sqlb, conn, 3, 3
if not rsb.eof then 
Currentbreed = trim(rsb("Breed"))
end if
rsb.close
end if

if len(BreedID2)> 0 then 
sqlb = "select * from SpeciesBreedLookupTable where BreedLookupID=" & BreedID2
rsb.Open sqlb, conn, 3, 3
if not rsb.eof then 
Currentbreed2 = trim(rsb("Breed"))
breedtitle = "Breeds"
end if
rsb.close
end if

if len(BreedID3)> 0 then 
sqlb = "select * from SpeciesBreedLookupTable where BreedLookupID=" & BreedID3
rsb.Open sqlb, conn, 3, 3
if not rsb.eof then 
Currentbreed3 = trim(rsb("Breed"))
breedtitle = "Breeds"
end if
rsb.close
end if

if len(BreedID4)> 0 then 
sqlb = "select * from SpeciesBreedLookupTable where BreedLookupID=" & BreedID4
rsb.Open sqlb, conn, 3, 3
if not rsb.eof then 
Currentbreed4 = trim(rsb("Breed"))
breedtitle = "Breeds"
end if
rsb.close
end if

%><br />	
<table cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "100%" border = "0" valign = "top" align = "left">
<tr><td >
<table cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "100%" border = "0" valign = "top" align = "left">
<% If Len(trim(PriceComments)) > 4 Then %>
 <tr><td  class = "Body" align = "center" align = "left" colspan = "2"><div align = "left"><b><%=PriceComments%></b><br /><br /></div>
     </td></tr>
<%End If %>
<tr>
<td width = 5></td>
<td colspan = 2>
<table cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "100%" border = "0" valign = "top" align = "left">
<tr><td width= 120 ></td><td ></td></tr>
<% if Free = 1 then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "Body" height = 30><b>Price</b></td><td class = "Body" align = "left"><b>Free</b></font></td></tr>
<% end if %>

<% If Sold = 1 Then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td></td><td  class = "Body" height = 30><br><font color = "#6a9ac6" ><b>SOLD</b></font></td></tr>
<% End if %>

<% If SalePending= 1 Then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td></td><td class = "Body"  height = 30><br><font color = "#6a9ac6" ><b>Sale Pending</b></font></td></tr>
<% End if %>

<% If Len(price) > 2 And Sold = 0 and Free = 0 and not (dutchauction = True) Then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" height = 30><b>Price</b></td><td  class = "Body"  >&nbsp;<b><%=formatcurrency(price,0)%></b></td></tr>
<%End If %>

<% If Len(price) < 2 And Sold = 1 and not Free=1 Then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "Body" height = 30 ><b>Price</b></td><td class = "Body" >&nbsp;<b>Call for Price</b></td></tr>
<%End If %>


<% If Len(Discount) > 1 and Free = 0 Then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" >Discount</td>
<td  class = "Body" height = 30>&nbsp;<b><font color ="#990000"><%=Discount%>%</font></b></td></tr>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" height = 30>Discount Price </td>
<td  class = "Body" >&nbsp;<b><font color ="#990000"><%=formatcurrency(DiscountPrice, 0)%></font></b></td></tr>
<%End If %>

<% If PublishStud = 1 And Sold = 0 Then %>
<% If Len(StudFee) > 2  Then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" height = 30><b>Stud Fee</b></td><td  class = "Body"  >&nbsp;<b><%=formatcurrency(StudFee,0)%></b></td></tr>
<% else %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" height = 30><b>Stud Fee</b></td><td  class = "Body"  >&nbsp;<b>Call for Fee</b></td></tr
<%End If %>
<%End If %>

<% if len(DOBMonth) > 0 or len(DOBDay) > 0  or len(DOBYear) > 0 then%>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" height = 30>DOB</td>
<td  class = "Body" >&nbsp;
<% if len(DOBMonth) > 0 then %>
<%=DOBMonth%>/
<% end if %>
<% if len(DOBDay) > 0 then %>
<%=DOBday%>/
<% end if %>
<%=DOBYear%>
</td></tr>	
<% end if %>

<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" height = 30 >Species</td><td  class = "Body">&nbsp;<%=signularanimal%></td></tr>	


<%if (len(BreedID)> 0 or len(BreedID2)> 0 or len(BreedID3)> 0 or len(BreedID4)> 0) and not (signularanimal = "Llama") then 
if BreedID> 0 or BreedID2> 0 or BreedID3 > 0 or BreedID4 > 0 then
%>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" ><%=breedtitle %></td>
<td class = "Body" height = 30>
&nbsp;<a href = "http://www.livestockoftheworld.com/<%=pluralanimal%>/breeds.asp?BreedLookupID=<%=BreedID%>&SpeciesID=<%=SpeciesID  %>" class = "body" target="_blank" ><%=Currentbreed%></a>

<% if len(BreedID2) > 0 and not(BreedID = BreedID2) and BreedID2>0 then %>,<a href = "http://www.livestockoftheworld.com/<%=pluralanimal%>/breeds.asp?BreedLookupID=<%=BreedID2%>&SpeciesID=<%=SpeciesID  %>" class = "body" target="_blank"><%=Currentbreed2%></a>
<% end if %>

<% if len(BreedID3) > 0  and not(BreedID = BreedID3) and BreedID3>0 then %>, <a href = "http://www.livestockoftheworld.com/<%=pluralanimal%>/breeds.asp?BreedLookupID=<%=BreedID3%>&SpeciesID=<%=SpeciesID  %>" class = "body" target="_blank"><%=Currentbreed3%></a>
<% end if %>

<% if len(BreedID4) > 0  and not(BreedID = BreedID4) and BreedID4>0 then %>, <a href = "http://www.livestockoftheworld.com/<%=pluralanimal%>/breeds.asp?BreedLookupID=<%=BreedID4%>&SpeciesID=<%=SpeciesID  %>" class = "body" target="_blank"><%=Currentbreed4%></a>
<% end if %> 
</td></tr>	
<% end if %>
<% end if %>

<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "Body" height = 30>Category</td>
<td class = "Body" >&nbsp;<%=Category%></td></tr>



<% If Len(color1) > 1 or Len(color2) > 1 or Len(color3) > 1 or Len(color4) > 1 Then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td  class = "body" height = 30 >Color</td>
<% end if %>
<td class = "Body" ><% If Len(color1) > 1 Then %>
&nbsp;<%=Color1%><% end if %>
<% If Len(color2) > 1 Then %> / <%=Color2%>
<% end if %>
<% If Len(color3) > 1 Then %>
/ <%=Color3%>
<% end if %>
<% If Len(color4) > 1 Then %>
/ <%=Color4%>
<% end if %>
<% If Len(color5) > 1 Then %>
<br />&nbsp;/ <%=Color5%>
 <% end if %>	
</td>
</tr>

<% if len(trim(Height)) > 0 then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "body" height = 30>&nbsp;Height:</td>
<td class = "body"><%= Height%></td>
</tr>
<% end if %>

<% if len(trim(Weight)) > 0 then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "body" height = 30>&nbsp;Weight:</td>
<td class = "body"><%= Weight%></td>
</tr>
<% end if %>
<% if len(trim(Horns)) > 0 then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "body" height = 30>&nbsp;Horns:</td>
<td class = "body"><%= Horns%></td>
</tr>
<% end if %>

<% 
if speciesID= 5 then

if len(trim(Gaited)) > 0 then
if Warmblooded = True then
Gaited = "Yes"
else
Gaited = "No"
end if %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "body" height = 30>&nbsp;Gaited</td>
<td class = "body"><%=Gaited%></td>
</tr>
<% end if %>



<% if len(trim(Warmblooded)) > 0 then 
if Warmblooded = True then
Warmblooded = "Yes"
else
Warmblooded = "No"
end if %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "body" >&nbsp;Warm blooded</td>
<td class = "body"><%=Warmblooded%></td>
</tr>
<% end if %>
<% end if %>
<% if Temperment = "0" then
Temperment = ""
end if
if len(trim(Temperment)) > 0 then
 %>
 <tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "body" height = 30>Temperament</td>
<td class = "body"><%=Temperment%> &nbsp;&nbsp;&nbsp;
<font color = "#555555">1=Very Calm, 10=Very High-Spirited</font></td>
</tr>
<% end if %>

<% if len(trim(Vaccinations)) > 0 then
 %>
 <tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "body" height = 30>Vaccinations</td>
<td class = "body"><%=Vaccinations%> </td>
</tr>
<% end if %>


<% 
x = 0


if len(SpeciesID) > 0 then 
 sql2 = "select * from SpeciesRegistrationTypeLookupTable where SpeciesID=" & speciesID
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3
while not(rs2.eof)  
RegNumber = ""

if rs3.state = 1 then
    rs3.close
end if


SpeciesRegistrationType = rs2("SpeciesRegistrationType")
sql3 = "select * from Animalregistration where RegType = '" & SpeciesRegistrationType & "' and AnimalID = " & ID
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then
RegNumber = rs3("Regnumber")
end if
rs3.close
if len(RegNumber) > 0 then
%>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td class = "Body" ><%=SpeciesRegistrationType %></td>
<td class = "Body" height= 30><%=RegNumber %></td></tr>
<% end if 
rs2.movenext
wend 
rs2.close 	
end if %>	

<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr>
<td class = "body" valign = top>
Owner</td>
<td class = "body" height = 30>

<% 

if len(BusinessName) > 0 then %>
&nbsp;<b><%=trim(BusinessName) %></b><br />
<% end if %>
<% if len(Addresscity) > 0 or len(Addressstate) then %>
<% if len(Addresscity) > 0 then%>
&nbsp;<%=trim(addresscity) %>
<% end if %>
<% if len(AddressState) > 0 then %>
<% if len(Addresscity) > 0 then %>,&nbsp;<% end if %>
<%=trim(addressState) %>
<% end if %>
<% end if %>
<br />
<% showfarmpages = False
if showfarmpages =  True then   %>
&nbsp;<a href = "/Ranches/ranchhome.asp?Peopleid=<%=currentpeopleid %>&screenwidth=<%=screenwidth %>" target = "_blank" class = "body">View Farm Pages</a>
<% end if %>
</td>



<% if len(CoOwnerBusiness1) > 1 or len(CoOwnerName1) > 1 or len(CoOwnerLink1) > 1 or len(CoOwnerBusiness2) > 1 or len(CoOwnerName2) > 1 or len(CoOwnerLink2) > 1 or len(CoOwnerBusiness3) > 1 or len(CoOwnerName3) > 1 or len(CoOwnerLink1) > 3 then %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr>
		<td class = "body" valign = "top">
        Co-Owned by</td>
        <td align = "left" class = "body" valign = "top" height = 30>
        
        <% if len(CoOwnerBusiness1) > 1 or len(CoOwnerName1) > 1 or len(CoOwnerLink1) > 1 then %>
        <% if len(CoOwnerLink1) > 1 then%>
                <a href = "http://<%=CoOwnerLink1 %>" class = "body" target = "blank">
        <% end if %>
           <%=CoOwnerBusiness1%>
           <%if len(CoOwnerName1) > 1 then%>
                   ,  <%=CoOwnerName1%>
            <% end if %>
      
       <% if len(CoOwnerLink1) > 1 then%>
                </a>
        <% end if %>
        <br />
          <% end if %>
        
         <% if len(CoOwnerBusiness2) > 1 or len(CoOwnerName2) > 1 or len(CoOwnerLink2) > 1 then %>
        <% if len(CoOwnerLink2) > 1 then%>
                <a href = "http://<%=CoOwnerLink2 %>" class = "body" target = "blank">
        <% end if %>
           <%=CoOwnerBusiness2%>
           <%if len(CoOwnerName2) > 1 then%>
                   ,  <%=CoOwnerName2%>
            <% end if %>
       
       <% if len(CoOwnerLink2) > 1 then%>
                </a>
        <% end if %>
        <br />
         <% end if %>
           <% if len(CoOwnerBusiness3) > 1 or len(CoOwnerName3) > 1 or len(CoOwnerLink3) > 1 then %>
        <% if len(CoOwnerLink3) > 1 then%>
                <a href = "http://<%=CoOwnerLink3 %>" class = "body" target = "blank">
        <% end if %>
           <%=CoOwnerBusiness3%>
           <%if len(CoOwnerName3) > 1 then%>
                   ,  <%=CoOwnerName3%>
            <% end if %>
     
       <% if len(CoOwnerLink3) > 1 then%>
                </a>
        <% end if %>
           <% end if %>
    </td>
 </tr>
<% end if %>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
</table>
</td></tr>
<tr>
<td colspan = "2" class = "body" valign = top>
<% Description = trim(Description)

str1 = Description
str2 = vbtab
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

if len(Description) > 1 then
For loopi=1 to Len(Description)
    spec = Mid(Description, loopi, 1)
    specchar = ASC(spec)

    
    if specchar < 32 or specchar > 126 then
    	Description= Replace(Description,  spec, " ")

   end if
  
 Next
end if
%>
<blockquote><br /><%=trim(Description) %></blockquote>				
</td></tr>
</table></td></tr>
<tr><td bgcolor = "#F2F2F2" height = 1 colspan = 2></td></tr>
<tr><td bgcolor = "#F2F2F2" height = 40 colspan = 2><div align = center><form action = '/Farms/FarmContactUs.asp?CurrentPeopleID=<%=CurrentPeopleID %>' method = "post" >
<input type = submit class=regsubmit value="Contact Seller" />
</form></div></td></tr>
</table>