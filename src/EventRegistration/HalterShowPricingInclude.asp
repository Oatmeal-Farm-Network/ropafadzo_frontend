<% if Session("LoggedIn") = true then %>
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "700" align = "center">	
<tr>
<td class = "body">
<h3>Prices</h3> 
</td>
</tr>
</table>


	
<%

dim OldAdvertisingNameArray(100)
	dim OldAdvertisingQTYArray(100)

	
	dim OldVendorNameArray(100)
	dim OldVendorQTYArray(100)
	dim OldVendorTableQTYArray(100)


	dim OldSponsorNameArray(100)
	dim OldSponsorQTYArray(100)

	
	dim OldClassesNameArray(100)
	dim OldClassesQTYArray(100)

	dim OldExtraOptionNameArray(100)
	dim OldExtraOptionQTYArray(100)



dim ClassesQTYArray(1000)
dim SponsorQTYArray(1000)
dim AdvertsingQTYArray(1000)
dim VendorQTYArray(1000)
dim VendorTableQTYArray(1000)
dim ExtraOptionsQTYArray(1000)


OrderTotal = 0

EventSubTypeID = request.querystring("EventSubTypeID")

sql3 = "select * from Event where EventID = " & EventID
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  AOBA = rs3("AOBA")
  AOBAFee = rs3("AOBAFee")
end if
rs3.close

if AOBA = True and len(AOBAFee) > 0 then
  ShowAOBAFee = "True"
end if



sql3 = "select * from Services where EventID = " & EventID
'response.write("sql3 = " & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
if not rs3.eof then 
  ServiceTypeLookupID = rs3("ServiceTypeLookupID")
end if



 sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID
 'response.write(sql3)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql3, conn, 3, 3   
while Not rs.eof 
	if rs("ServiceType") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs("ServiceType") = "Fleece Show" then
       ShowFleeceShow = True 
     End If

     if rs("ServiceType") = "Vendors" then
       ShowVendors = True 
     End If


     	if rs("ServiceType") = "Stud Auction" then
       		ShowStudauction = True 
     	End If

	if rs("ServiceType") = "SpinOff" then
       		ShowSpinOff = True 
     	End If



     if rs("ServiceType") = "Sponsor" then
       ShowSponsors = True
     End If
     
     if rs("ServiceType") = "Advertising" then
       ShowAdvertising = True
     End If


     if rs("ServiceType") = "Classes / Workshops" then
       ShowClasses = True 
     End If

     if rs("ServiceType") = "Dinner" then
       ShowDinner = True 
     End If
     
     

     if rs("ServiceType") = "Silent Auction" then
       ShowSilentAuction = True
     End If
rs.movenext
wend
 sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")

	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")

	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")

	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")

	
	EventTypeID = rs("EventTypeID")
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	

	
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	MaxQTY3 =  rs("ServiceMaxQuantity3")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	VetCheckFee = rs("VetCheckFee")
	ElectricityFee = rs("ElectricityFee")
	ElectricityAvailable  = rs("ElectricityAvailable")
	

	Electricityoptional  = rs("Electricityoptional")



	MaxPensPerFarm = rs("MaxPensPerFarm")
	
	if MaxPensPerFarm > 0 then
	else
		MaxPensPerFarm = 40
	end if 



	MaxDisplaysPerFarm= rs("MaxDisplaysPerFarm")
	
	if MaxDisplaysPerFarm > 0 then
	else
		MaxDisplaysPerFarm = 40
	end if 
	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")

	StallMatPrice = rs("StallMatPrice")
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 
if len(Price1DiscountStartDateMonth) > 0 and len(Price1DiscountStartDateDay) > 0 and len(Price1DiscountStartDateYear) > 0 then
	Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
end if
if len(Price1DiscountEndDateMonth) > 0 and len(Price1DiscountEndDateDay) > 0 and len(Price1DiscountEndDateYear) > 0 then
	Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear
end if


if len(Price2DiscountStartDateMonth) > 0 and len(Price2DiscountStartDateDay) > 0 and len(Price2DiscountStartDateYear) > 0 then
	Price2DiscountStartDate = Price2DiscountStartDateMonth & "/" & Price2DiscountStartDateDay & "/" & Price2DiscountStartDateYear
end if
if len(Price2DiscountEndDateMonth) > 0 and len(Price2DiscountEndDateDay) > 0 and len(Price2DiscountEndDateYear) > 0 then
	Price2DiscountEndDate = Price2DiscountEndDateMonth & "/" & Price2DiscountEndDateDay & "/" & Price2DiscountEndDateYear
end if

if len(Price3DiscountStartDateMonth) > 0 and len(Price3DiscountStartDateDay) > 0 and len(Price3DiscountStartDateYear) > 0 then
	Price3DiscountStartDate = Price3DiscountStartDateMonth & "/" & Price3DiscountStartDateDay & "/" & Price3DiscountStartDateYear
end if
if len(Price3DiscountEndDateMonth) > 0 and len(Price3DiscountEndDateDay) > 0 and len(Price3DiscountEndDateYear) > 0 then
	Price3DiscountEndDate = Price3DiscountEndDateMonth & "/" & Price3DiscountEndDateDay & "/" & Price3DiscountEndDateYear
end if

if len(Price4DiscountStartDateMonth) > 0 and len(Price4DiscountStartDateDay) > 0 and len(Price4DiscountStartDateYear) > 0 then
	Price4DiscountStartDate = Price4DiscountStartDateMonth & "/" & Price4DiscountStartDateDay & "/" & Price4DiscountStartDateYear
end if
if len(Price4DiscountEndDateMonth) > 0 and len(Price4DiscountEndDateDay) > 0 and len(Price4DiscountEndDateYear) > 0 then
	Price4DiscountEndDate = Price4DiscountEndDateMonth & "/" & Price4DiscountEndDateDay & "/" & Price4DiscountEndDateYear
end if

if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 

if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
end if

RegistrationOpen = True 

if len(ServiceEndDate) < 6  then %>
<center><h2>The Registration End Date on this Show Has Not Been Determined</h2></center>
<% end if %>


<% if len(ServiceEndDate) > 6 and DateDiff("d", ServiceEndDate, now()) > 1 then
  RegistrationOpen = False %>
<center><h2>Registration is Closed</h2>
Regestration for this show ended on <%=ServiceEndDate %></center>
<% end if %>

<% if len(ServiceStartDate) > 6 and DateDiff("d", ServiceStartDate, now()) < 1 then
  RegistrationOpen = False %>
<center><h2>Registration Has Not Opened Yet</h2>
Registration will open on <%=ServiceStartDate %></center>
<% end if %>

<% if RegistrationOpen = True then %>





<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "700" align = "center">	
<tr>
  <td class = "body" align = "center" background = "images/Registrationheader.jpg" height = "39">

<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "690" align = "center">	
<tr>
  <td class = "body" width= "440"><img src = "images/px.gif" width = "5" height = "1" alt = "Event registration"><h3>Service</h3></td>
  <td class = "body" align = "center" width = "90"><h3>Price</h3></td>
</tr>
</table>
</td>
</tr>
<tr>
  <td background = "images/Registrationbackground.jpg">
  	<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "690" align = "center">
  


<%

 '********************************************************************************
 '	CREATE ARRAY OF SPPONSORSHIPS
 '********************************************************************************

dim SponsorNameArray(100)
dim SponsorIDArray(100)
dim ExtraOptionSponsorQTYArray(100)


sql4 = "select * from SponsorshipLevelbenefits, Sponsorshiplevels  where SponsorshipLevelbenefits.SponsorshipLevelID = Sponsorshiplevels.SponsorshipLevelID and Sponsorshiplevels.EventID = " & EventID & " order by SponsorshipLevelName"
		'response.write("<br>sql4=" & sql4 )
			
Set rs4 = Server.CreateObject("ADODB.Recordset")
rs4.Open sql4, conn, 3, 3 
if not rs4.eof then 
   i = 1
   
    				ExtraOptionSponsorQTYArray(i) = 0
    				SponsorIDArray(i) = rs4("ExtraOptionID")
    				SponsorNameArray(i) = rs4("SponsorshipLevelName")
    				OldOptionName = rs4("SponsorshipLevelName")
    				
    				while not rs4.eof 

    				 NewOptionName = rs4("SponsorshipLevelName")
				     if not(OldOptionName = NewOptionName) then
				      	i = i + 1
				      	ExtraOptionSponsorQTYArray(i) = 0
				      	SponsorIDArray(i) = rs4("ExtraOptionID")
				      	SponsorNameArray(i) = rs4("SponsorshipLevelName")
				     end if
    				
    				
	SponsorshipLevelID = rs4("SponsorshipLevelID") 
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)
	ExtraOptionSponsorQTYArray(i) = ExtraOptionSponsorQTYArray(i) +  ( rs4("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID) )
	 
	'response.write("<br>i = " & i )
   	'response.write("<br>ID = " & SponsorIDArray(i) )
   	'response.write("<br>QTY = " & ExtraOptionSponsorQTYArray(i) & "<br>" )
	
    OldOptionName = rs4("SponsorshipLevelName")
    			
    rs4.movenext
 wend
 
 TotalSponsorshipCounter = i
 
 i = 1
 for i = 1 to TotalSponsorshipCounter
    'response.write("<br>i = " & i )
   'response.write("<br>ID = " & SponsorIDArray(i) )
   'response.write("<br>QTY = " & ExtraOptionSponsorQTYArray(i) & "<br>" )
 
 
 next
 
end if




 '********************************************************************************
 '	CREATE ARRAY OF EXTRA OPTIONS
 '********************************************************************************
dim ExtraOptionID(100)
dim ExtraOptionQTY(100)

sql4 = "select * from SponsorshipLevelbenefits, ExtraOptions where OptionType ='ExtraOption' and SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and SponsorshipLevelQTY > 0 and ExtraOptions.EventID = " & EventID & " order by ExtraOptionsname"
		'response.write("sql4=" & sql4 )
			
		    		Set rs4 = Server.CreateObject("ADODB.Recordset")
    				rs4.Open sql4, conn, 3, 3 
    				if not rs4.eof then 
    				TotalSponsorshipLevelQTY = 0
    				i = 1
    				ExtraOptionQTY(i) = 0
    				ExtraOptionID(i) = rs4("ExtraOptionID")
    				OldOptionName = rs4("ExtraOptionsName")
    				
    				while not rs4.eof 

    				 NewOptionName = rs4("ExtraOptionsName")
				     if not(OldOptionName = NewOptionName) then
				      	i = i + 1
				      	ExtraOptionQTY(i) = 0
				      	ExtraOptionID(i) = rs4("ExtraOptionID")
				     end if
    				%>
    				
	
	<% 
	SponsorshipLevelID = rs4("SponsorshipLevelID") 
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)
	ExtraOptionQTY(i) = ExtraOptionQTY(i) +  ( rs4("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID) )
	 
	'response.write("<br>i = " & i )
   	'response.write("<br>ID = " & ExtraOptionID(i) )
   	'response.write("<br>QTY = " & ExtraOptionQTY(i) & "<br>" )
	
    			OldOptionName = rs4("ExtraOptionsName")
    			
    			rs4.movenext
 wend
 
 TotalExtraOptions = i
 
 i = 1
 for i = 1 to TotalExtraOptions
   'response.write("<br>i = " & i )
   'response.write("<br>ID = " & ExtraOptionID(i) )
   'response.write("<br>QTY = " & ExtraOptionQTY(i) & "<br>" )
 
 
 next
 
end if


 
 '********************************************************************************
 '	CREATE ARRAY OF VENDOR OPTIONS
 '********************************************************************************
dim VendorNameArray(100)
dim VendorIDArray(100)
dim ExtraOptionVendorQTYArray(100)


sql4 = "select * from SponsorshipLevelbenefits, ExtraOptions where OptionType ='Vendor' and SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and SponsorshipLevelQTY > 0 and ExtraOptions.EventID = " & EventID & " order by ExtraOptionsname"
		'response.write("sql4=" & sql4 )
			
Set rs4 = Server.CreateObject("ADODB.Recordset")
rs4.Open sql4, conn, 3, 3 
if not rs4.eof then 
   i = 1
    				ExtraOptionVendorQTYArray(i) = 0
    				VendorIDArray(i) = rs4("ExtraOptionID")
    				VendorNameArray(i) = rs4("ExtraOptionsName")
    				OldOptionName = rs4("ExtraOptionsName")
    				
    				while not rs4.eof 

    				 NewOptionName = rs4("ExtraOptionsName")
				     if not(OldOptionName = NewOptionName) then
				      	i = i + 1
				      	ExtraOptionVendorQTYArray(i) = 0
				      	VendorIDArray(i) = rs4("ExtraOptionID")
				      	VendorNameArray(i) = rs4("ExtraOptionsName")
				     end if
    				
    				
	SponsorshipLevelID = rs4("SponsorshipLevelID") 
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)
	ExtraOptionVendorQTYArray(i) = ExtraOptionVendorQTYArray(i) +  ( rs4("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID) )
	 
	'response.write("<br>i = " & i )
   	'response.write("<br>ID = " & VendorIDArray(i) )
   	'response.write("<br>QTY = " & ExtraOptionVendorQTYArray(i) & "<br>" )
	
    OldOptionName = rs4("ExtraOptionsName")
    			
    rs4.movenext
 wend
 
 TotalVendorOptions = i
 
 i = 1
 for i = 1 to TotalVendorOptions
   'response.write("<br>i = " & i )
   'response.write("<br>ID = " & VendorIDArray(i) )
   'response.write("<br>QTY = " & ExtraOptionVendorQTYArray(i) & "<br>" )
 
 
 next
 
end if


 '********************************************************************************
 '	CREATE ARRAY OF ADVERTISING OPTIONS
 '********************************************************************************
dim AdvertisingNameArray(100)
dim AdvertisingIDArray(100)
dim ExtraOptionAdvertsingQTYArray(100)



sql4 = "select * from SponsorshipLevelbenefits, ExtraOptions where OptionType ='Advertising' and SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and SponsorshipLevelQTY > 0 and ExtraOptions.EventID = " & EventID & " order by ExtraOptionsname"
		'response.write("sql4=" & sql4 )
			
		    		Set rs4 = Server.CreateObject("ADODB.Recordset")
    				rs4.Open sql4, conn, 3, 3 
    				if not rs4.eof then 
    				i = 1
    				ExtraOptionAdvertsingQTYArray(i) = 0
    				AdvertisingIDArray(i) = rs4("ExtraOptionID")
    				AdvertisingNameArray(i) = rs4("ExtraOptionsName")
    				OldOptionName = rs4("ExtraOptionsName")
    				
    				while not rs4.eof 

    				 NewOptionName = rs4("ExtraOptionsName")
				     if not(OldOptionName = NewOptionName) then
				      	i = i + 1
				      	ExtraOptionAdvertsingQTYArray(i) = 0
				      	AdvertisingIDArray(i) = rs4("ExtraOptionID")
				      	AdvertisingNameArray(i) = rs4("ExtraOptionsName")
				     end if
    		
    				
	SponsorshipLevelID = rs4("SponsorshipLevelID") 
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)
	ExtraOptionAdvertsingQTYArray(i) = ExtraOptionAdvertsingQTYArray(i) +  ( rs4("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID) )
	 
	'response.write("<br>i = " & i )
   	'response.write("<br>ID = " & AdvertisingIDArray(i) )
   	'response.write("<br>QTY = " & ExtraOptionAdvertsingQTYArray(i) & "<br>" )
	
    OldOptionName = rs4("ExtraOptionsName")
    			
    rs4.movenext
 wend
 
 TotalAdvertisingOptions = i
 
 i = 1
 for i = 1 to TotalExtraOptions
   'response.write("<br>i = " & i )
   'response.write("<br>ID = " & AdvertisingIDArray(i) )
   'response.write("<br>QTY = " & ExtraOptionAdvertsingQTYArray(i) & "<br>" )
 
 
 next
 
end if




 '********************************************************************************
 '	SPONSORSHIP OPTIONS
 '********************************************************************************

'dim SponsorNameArray(100)
'dim SponsorIDArray(100)
'dim ExtraOptionSponsorQTYArray(100)


  if showsponsors = true then
 
 	sql = "select * from SponsorshipLevels  where EventID = " & EventID
 	
'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	
	
	  <tr >
		<td class = "body" colspan = "4" height = "30">
	       <img src = "/images/px.gif" width = "5" alt = "Sponsorship Options"><h3>Sponsorships</h3>
	     </td>
	   </tr>
	<%
	
	order = "odd"
	While Not rs.eof  
	SponsorshipLevelID = rs("SponsorshipLevelID")
		SponsorshipLevelName= rs("SponsorshipLevelName")
		SponsorshipLevelDescription= rs("SponsorshipLevelDescription")
		SponsorshipLevelPrice = rs("SponsorshipLevelPrice")
		SponsorshipLevelQTYAvailable = rs("SponsorshipLevelQTYAvailable")
		SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")

   if len(SponsorshipLevelQTYAvailable) > 0 then
   else
     SponsorshipLevelQTYAvailable = 50
   end if
	SponsorQTYArraycount = "SponsorQTYArray(" & SponsorshipLevelID & ")"
	SponsorQTYArray(SponsorshipLevelID) = Request.Form(SponsorQTYArraycount)

	'response.write("SponsorQTYArray(SponsorshipLevelID) =" & SponsorQTYArray(SponsorshipLevelID)  )


	i = 0
	while i < (TotalSponsorCounter + 1 )
	   	i = i + 1
		if OldSponsorNameArray(i) = SponsorshipLevelName  then
			OldSponsorQTY = OldSponsorQTYArray(i)
		end if
	wend


if SponsorQTYArray(SponsorshipLevelID) < 1 and OldSponsorQTY > 0  and NOT(Update = "True") then
	SponsorQTYArray(SponsorshipLevelID) = OldSponsorQTY
end if
	%>
    <tr>
	<td class = "body" width = "440">
	<% 'response.write("SponsorQTYArray(SponsorshipLevelID) =" & SponsorQTYArray(SponsorshipLevelID)  ) %>
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration"><%= SponsorshipLevelName %><bR>

	</td>
	<td class = "body" align = "right" width = "90">	
		<%= formatcurrency(SponsorshipLevelPrice) %><img src = "/images/px.gif" width = "10" alt = "Sponsorship Registration">
    </td>


	   </tr>
	 

<% 

sql3 = "select * from SponsorshipLevelbenefits, ExtraOptions where SponsorshipLevelbenefits.ExtraOptionID = ExtraOptions.ExtraOptionsID and  SponsorshipLevelID = " & SponsorshipLevelID & " and SponsorshipLevelQTY > 0 and ExtraOptions.EventID = " & EventID & ""
'response.write("<br>sql3=" & sql3 & "<br>")
Set rs3 = Server.CreateObject("ADODB.Recordset")
rs3.Open sql3, conn, 3, 3   
while Not rs3.eof
'response.write("<br><br>SponsorshipLevelName=" & SponsorshipLevelName  & "<br>")


    if rs3("ExtraOptionsName") = "Free Halter Stall" then
    	TotalFreeHalterStallQTY = TotalFreeHalterStallQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    	'response.write("TotalFreeHalterStallQTY=" & TotalFreeHalterStallQTY  & "<br>")
    end if 
 
 
    if rs3("ExtraOptionsName") = "Free Display Stall" then
    	TotalFreeDisplayStallQTY = TotalFreeDisplayStallQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    	'response.write("TotalFreeDisplayStallQTY=" & TotalFreeDisplayStallQTY & "<br>")
    end if 


   if trim(rs3("ExtraOptionsName")) = "Expidited Vet Check in" then
    	TotalExpiditedVetCheckinQTY = TotalExpiditedVetCheckinQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    	'response.write("TotalExpiditedVetCheckinQTY=" & TotalExpiditedVetCheckinQTY  & "<br>")
    end if 

    if rs3("ExtraOptionsName") = "Free Vet Check in" then
    	TotalFreeVetCheckinQTY = TotalFreeVetCheckinQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    	'response.write("TotalFreeVetCheckinQTY =" & TotalFreeVetCheckinQTY  & "<br>")
    end if 


    if rs3("ExtraOptionsName") = "Free Stall Mat" then
    	TotalFreeStallMatQTY = TotalFreeStallMatQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    	'response.write("TotalFreeStallMatQTY =" & TotalFreeStallMatQTY & "<br>" )
    end if 

    if rs3("ExtraOptionsName") = "Free Electricity" then
    	TotalFreeElectricityQTY = TotalFreeElectricityQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    	'response.write("TotalFreeElectricityQTY =" & TotalFreeElectricityQTY & "<br>" )
    end if

	if rs3("ExtraOptionsName") = "Free Dinner Ticket(s)" then
    	TotalFreeDinnerTicketsQTY = TotalFreeDinnerTicketsQTY + ( rs3("SponsorshipLevelQTY") * SponsorQTYArray(SponsorshipLevelID))
    	'response.write("TotalFreeDinnerTicketsQTY =" & TotalFreeDinnerTicketsQTY  & "<br>")
    end if


	
	rs3.movenext
wend
rs3.close	
		
	
 
  
  rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if 
  
  end if
  %>
 <tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>




<% if  ShowHalterShow = True  then %>

 <tr >
		<td class = "body" colspan = "4" height = "30">
	       <img src = "/images/px.gif" width = "5" alt = "Halter Show Registration"><h3>Halter Show</h3>
	     </td>
	   </tr>


<%
'************************************************************
'  ANIMAL STALLS
'************************************************************
'response.write("FeePerPen=" & FeePerPen )

 if  FeePerPen > 0 then
AnimalStallQTY = request.form("AnimalStallQTY")

if AnimalStallQTY < 1 and OldAnimalStallsQuantity > 0 and NOT(Update = "True") then
	AnimalStallQTY = OldAnimalStallsQuantity
end if

 showdiscount = False
if len(Price2Discount) > 0 and len(Price2DiscountStartDate) > 4 and len(Price2DiscountStartDate) > 4 then
  if DateDiff("d", Price2DiscountStartDate, now()) > 1 and DateDiff("d", Price2DiscountEndDate, now()) < 1 then
 	 FullPriceFeePerPen = FeePerPen
 	 FeePerPen = Price2Discount
 	  showdiscount = True
	end if 
end if

if len(AnimalStallQTY) > 0  and len(FeePerPen) > 0  then
	AnimalStallTotal = AnimalStallQTY * FeePerPen
else
	AnimalStallTotal = 0
end if 

 %>
<tr>
  <td class = "body" width = "440">
  <input type = "hidden" value = "<%=FeePerPen %>" name = "FeePerPen">
  
  <% if len(FeePerPen) > 1 then %>
  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Animal Stalls 
  <% if len(MaxQTY) > 0 or len(MaxQTY2) > 0 then %><small>-<% end if %>
  	<% if len(MaxQTY2) > 0 then %><%=MaxQty2%> adults <% end if %>
  	<% if len(MaxQTY) > 0 and len(MaxQTY2) > 0 then %> OR <% end if %>
  	 <% if len(MaxQTY) > 0 then %><%=MaxQty%> juveniles per stall <% end if %>  
   <% if len(MaxQTY) > 0 or len(MaxQTY2) > 0 then %></small><% end if %>
  <% if showdiscount = True then %>
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount Rate from <%=Price2DiscountStartDate %> To <% =Price2DiscountEndDate %>.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" width = "90">
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullPriceFeePerPen,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Event Registration"><br>
 			<%=formatcurrency(FeePerPen,2)%>
 		<% else %>
	  <%=formatcurrency(FeePerPen,2)%>
	
<% end if %>

<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 



<% if TotalFreeHalterStallQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" align = "right" colspan = "2" valign = "top">
   <img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration"><small>Animal stalls that come with your sponsorship<% if TotalFreeHalterStallQTY > 1 then %>s<%end if %>:</small>
</td>
<td class = "body" align = "right" valign = "top">
	<%=TotalFreeHalterStallQTY%><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right" valign = "top">
N/A<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "9" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if %>
<% end if %>
<% end if %>





<%
'************************************************************
'  DISPLAY STALLS
'************************************************************
%>

<% if  Price3 > 0 then
DisplayStallQTY = request.form("DisplayStallQTY")

	if DisplayStallQTY < 1 and OldDisplayStallsQTY > 0 and NOT(Update = "True") then
		DisplayStallQTY = OldDisplayStallsQTY
	end if


CurrentNumDisplayStallQTY = DisplayStallQTY
 showdiscount = False
if Price3Discount > 0 and len(Price3DiscountStartDate) > 5 and len(Price3DiscountStartDate) > 5 then
  if DateDiff("d", Price3DiscountStartDate, now()) > 1 and DateDiff("d", Price3DiscountEndDate, now()) < 1 then
 	 FullPricePrice3 = Price3
 	 Price3 = Price3Discount
 	  showdiscount = True
	end if 
end if


if len(AnimalStallQTY) > 0  and len(Price3) > 0  then
	DisplayStallTotal = DisplayStallQTY * Price3
else
	DisplayStallTotal = 0
end if 

 %>
<tr>
  <td class = "body" width = "440">
    <input type = "hidden" value = "<%= Price3 %>" name = "DisplayStallPrice">

  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Display Stalls 
  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price3DiscountStartDate %> to <% =Price3DiscountEndDate %>.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" width = "90">
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullPricePrice3,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Event Registration"><br>
 			<%=formatcurrency(Price3,2)%>
 			<% else %>
	  <%=formatcurrency(Price3,2)%>
	
<% end if %>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  
</tr> 


<% if TotalFreeDisplayStallQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" valign = "top" align="right" colspan = "2">
   <small>Display stalls that come with your sponsorship<% if TotalFreeDisplayStallQTY > 1 then %>s<%end if %>:</small>
</td>
<td class = "body" align = "right">
	<%=TotalFreeDisplayStallQTY%><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
</tr>
<% end if %>

<% end if %>






<%
'************************************************************
'  HALTER SHOW ENTRIES
'************************************************************
%>

<% if  FeePerAnimal > 0 then
AnimalQTY = request.form("AnimalQTY")


if AnimalQTY < 1 and OldHalterShowEntriesQuantity > 0 and NOT(Update = "True") then
	AnimalQTY = OldHalterShowEntriesQuantity
end if


if len(MaxQty2) > 0 then
else
MaxQty2 = 3
end if 
 showdiscount = False
if Price1Discount > 0 and len(Price1DiscountStartDate) > 5 and len(Price1DiscountStartDate) > 5 then
  if DateDiff("d", Price1DiscountStartDate, now()) > 1 and DateDiff("d", Price1DiscountEndDate, now()) < 1 then
 	 FullPricePrice1 = FeePerAnimal
 	 FeePerAnimal = Price1Discount
 	  showdiscount = True
	end if 
end if

if len(AnimalQTY) > 0  and len(FeePerAnimal) > 0   then
	AnimalTotal = AnimalQTY * FeePerAnimal
	else
	AnimalTotal = 0
end if 
'response.write("AnimalStallQTY=" & AnimalStallQTY )

 %>
<tr>
  <td class = "body" width = "440">
    <input type = "hidden" value = "<%= FeePerAnimal %>" name = "HalterShowFee">
 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Halter Show Entries
 <% if AnimalStallQTY = 0 and TotalFreeHalterStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Before you add animals please select stalls to put them in.</font></small>

<% end if %> 
 	<% if MaxQTY3 > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY3 %> Entries Per Exhibitor Per Class.</small>
	<% end if %>

  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price1DiscountStartDate %> to <% =Price1DiscountEndDate %>.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" width = "90">
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullPricePrice1,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Event Registration"><br>
 			<%=formatcurrency(FeePerAnimal,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerAnimal,2)%>
	
<% end if %>
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 






<%
'************************************************************
'  PRODUCTION CLASS HALTER SHOW ENTRIES
'************************************************************

ProductionPrice = Price4
ProductionPriceDiscount = Price4Discount
ProductionPriceDiscountStartDate = Price4DiscountStartDate
ProductionPriceDiscountEndDate = Price4DiscountEndDate


if  ProductionPrice > 0 then
ProductionQTY = request.form("ProductionQTY")
if len(ProductionQTY) > 0 then
else
ProductionQTY = 0
end if 

'response.write("OldProductionClasEntriesQuantity = " & OldProductionClasEntriesQuantity)

'response.write("ProductionQTY = " & ProductionQTY & "<br>" )


if ProductionQTY < 1  and  OldProductionClasEntriesQuantity > 0 and  NOT(Update = "True") then
	ProductionQTY = OldProductionClasEntriesQuantity
END IF


 showdiscount = False
 
if ProductionPriceDiscount > 0 and len(ProductionPriceDiscountStartDate) > 5 and len(ProductionPriceDiscountStartDate) > 5 then
  if DateDiff("d", ProductionPriceDiscountStartDate, now()) > 1 and DateDiff("d", ProductionPriceDiscountEndDate, now()) < 1 then
 	 FullPriceProductionPrice = ProductionPrice
 	 ProductionPrice = ProductionPriceDiscount
 	  showdiscount = True
	end if 
end if

if len(ProductionQTY) > 0  and len(FeePerAnimal) > 0  then
	ProductionPriceTotal = ProductionQTY * ProductionPrice
	else
	ProductionPriceTotal = 0
end if 

 %>
<tr>
  <td class = "body" width = "440">

 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Halter Show Production Class Entries
 <% sqlp = "select * from AnimalProductionClassesLookup where SpeciesID = 1"
			'response.write(sql)
			Set rsp = Server.CreateObject("ADODB.Recordset")
			rsp.Open sqlp, conn, 3, 3
			if not rsp.eof then %><% i = 0
				 while Not rsp.eof  
				AnimalProductionLookupID = rsp("AnimalProductionLookupID")
				ProductionClassName = rsp("ProductionClassName") 
				 sqlp2 = "select * from AnimalProductionClasses where AnimalProductionLookupID = " & AnimalProductionLookupID & " and EventID =" & EventID
				'response.write(sqlp2)
				Set rsp2 = Server.CreateObject("ADODB.Recordset")
				rsp2.Open sqlp2, conn, 3, 3
					if not rsp2.eof then 
					 i = i + 1 
					 if i > 1 then %>, <% else %><small>-<% end if %><%=ProductionClassName%>
				<% end if 
				rsp2.close 
				 rsp.movenext
			wend 
			rsp.close %>
			</small><% end if %>

 
 <% if AnimalStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Before you add animals please select stalls to put them in.</font></small>

<% end if %> 
	<% if MaxQTY3 > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY3 %> Entries Per Exhibitor Per Class: .</small>
	<% end if %>


  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=ProductionPriceDiscountStartDate %> to <% =ProductionPriceDiscountEndDate %>.</small>
	<% end if %>

 </td>
</tr> 

<% end if %>



<%
'************************************************************
'  COMPANION ANIMALS
'************************************************************
%>
<% if  ShowHalterShow = True  then %>
<% UnshownQTY = request.form("UnshownQTY")
 
if  UnshownQTY < 1  and OldCompanionAnimalQuantity > 0 and  NOT(Update = "True") then
	UnshownQTY = OldCompanionAnimalQuantity
end if

%>
<tr>
  <td class = "body" width = "440">

  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Companion Animals <small>(animals that will not be shown)</small>
 <% if AnimalStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Before you add animals please select stalls to put them in.</font></small>

<% end if %> 

 
 </td>
  <td class = "body" align = "right" width = "90">
  N/A


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 

<% end if %>





<%
'************************************************************
'  VET CHECK FEE
'************************************************************
%>

<% if  VetCheckFee > 0 then

'response.write("TotalFreeVetCheckinQTY=" & TotalFreeVetCheckinQTY )

if TotalFreeVetCheckinQTY < 1 then


VetCheckQTY = request.form("VetCheckQTY")
if VetCheckQTY < 1 and OldVetCheckQuantity > 0 and  NOT(Update = "True") then
 VetCheckQTY = OldVetCheckQuantity
end if


 showdiscount = False
 
if Price4Discount > 0 and len(Price4DiscountStartDate) > 5 and len(Price4DiscountStartDate) > 5 then
  if DateDiff("d", Price4DiscountStartDate, now()) > 1 and DateDiff("d", Price4DiscountEndDate, now()) < 1 then
 	 FullPricePrice4 = Price4
 	 Price4 = Price4Discount
 	  showdiscount = True
	end if 
end if

if len(VetCheckQTY) > 0  and len(FeePerAnimal) > 0  then
	Price4Total = VetCheckQTY * FeePerAnimal
	else
	Price4Total = 0
end if 

 %>
<tr>
  <td class = "body" width = "440">
    <input type = "hidden" value = "<%= VetCheckFee %>" name = "VetCheckFee">
     
  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Vet Check Fee
 
 <% if AnimalQTY = 0  and UnshownQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee will automatically be added if you register animals.</font></small>

<% end if %> 

 </td>
  <td class = "body" align = "right" width = "90">
  <%=formatcurrency(VetCheckFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 



<% end if %>

<% end if %>




<% end if %>



<%
'************************************************************
'  ELECTRICITY FEE
'************************************************************
 if  TotalFreeElectricityQTY < 1 then 
 
if  ElectricityAvailable= "True" then


ElectricityQTY = request.form("ElectricityQTY")

if ElectricityQTY < 1 and OldElectricityQuantity > 0 and NOT(Update = "True") then
	ElectricityQTY = OldElectricityQuantity
end if


 showdiscount = False
 
 %>
<tr>
  <td class = "body" width = "440"><img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Electricity Fee
  

 <% if Electricityoptional  ="True" then %>
 
  
 <% if AnimalStallQTY = 0 or DisplayStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee will automatically be added if you add animal <br><img src = "images/px.gif" width = "5" height = "1" alt = "Event Registration"> or display stalls.</font></small>

<% end if %> 

 </td>
  <td class = "body" align = "right" width = "90">
      <input type = "hidden" value = "<%= ElectricityFee %>" name = "ElectricityFee">
  <%=formatcurrency(ElectricityFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 





<% else ' Electricity Optional= False %>




 <% if AnimalStallQTY = 0 or DisplayStallQTY = 0 then %>
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee will automatically be added if you add a animal<br><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">or display stall.</font></small>
</td>
  <td class = "body" align = "right" width = "90">
  <%=formatcurrency(ElectricityFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 
<% end if %> 
<% end if ' Electricity is Available %>



 <tr><td colspan = "4"> </td></tr>
 <% end if %>
 
<% else %>
<tr bgcolor = "#F6F6F6" height = "20" >
<td class = "body" colspan = "2" align = "right">    <input type = "hidden" value = "0" name = "VetCheckFee">
   <small>Electricity comes with your sponsorship<% if TotalFreeDisplayStallQTY > 1 then %>s<%end if %>.</small>
</td>
<td class = "body" align = "right">
	1<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right">
$0.00<img src = "images/px.gif" width = "5" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if %>




<%
'************************************************************
'  STALL MATS FEE
'************************************************************
%>

<% if  StallMatsAvailable= "True" and StallMatPrice > 0   then
StallMatsQTY = request.form("StallMatsQTY")

	if StallMatsQTY > 1 and OldStallMatQuantity	 > 0 and NOT(Update = "True") then
	else
		StallMatsQTY =  OldStallMatQuantity	
	end if


 showdiscount = False
 
 %>
<tr>
 <td class = "body" width = "440"><img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Stall Mats
  
  <% if AnimalStallQTY > 0 or DisplayStallQTY > 0 or TotalFreeHalterStallQTY > 0 or TotalFreeDisplayStallQTY > 0  then 
  	else %>
  <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Before you can add stall matts you need to select stalls to <br><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">put them in.</small>
  
  <% end if %>
 </td>
  <td class = "body" align = "right" width = "90">
      <input type = "hidden" value = "<%= StallMatPrice %>" name = "StallMatPrice">
  <%=formatcurrency(StallMatPrice,2)%>
 

<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 



<% if TotalFreeStallMatQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" colspan = "2" align = "right">
   <small># Stall Mats that come with your sponsorship<% if TotalFreeStallMatQTY > 1 then %>s<%end if %>:</small>
</td>
<td class = "body" align = "right">
	<%=TotalFreeStallMatQTY %><img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
<td class = "body" align = "right">
N/A<img src = "images/px.gif" width = "20" height = "1" alt = "Event Registration">
</td>
</tr>
 <tr ><td class = "body" colspan = "4" height = "10" ><img src = "/images/px.gif" width = "1" alt = "Event Registration"></td></tr>
<% end if %>



<% end if ' Stall Matts are Available %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
 <tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
<% end if 'END IF SHOWHALTERSHOW = TRUE %>



<% if  ShowFleeceShow = True then %>

	  <tr >
		<td class = "body" colspan = "4" height = "30">
	       <img src = "/images/px.gif" width = "5" alt = "Sponsorship Options"><h3>Fleece Show</h3>
	     </td>
	   </tr>

<%
'************************************************************
'  FLEECE SHOW ENTRIES
'************************************************************
 sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Fleece Show' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	



	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")

	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")

	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")

	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")

	
		FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if

	
	
End If 



Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear

if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 


if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
end if

RegistrationOpen = True 

 if FeePerAnimal > 0 then
FleecesQTY = request.form("FleecesQTY")

if FleecesQTY < 1 and OldFleeceShowQuantity > 0 and  NOT(Update = "True") then
	FleecesQTY = OldFleeceShowQuantity
end if

 showdiscount = False
 FullFeePerAnimal = FeePerAnimal
if Price1Discount > 0 and len(Price1DiscountStartDate) > 5 and len(Price1DiscountStartDate) > 5 then
  if DateDiff("d", Price1DiscountStartDate, now()) > 1 and DateDiff("d", Price1DiscountEndDate, now()) < 1 then
 	 
 	 FeePerAnimal = Price1Discount
 	  showdiscount = True
	end if 
end if

if len(FleecesQTY) > 0  and len(FeePerAnimal) > 0   then
	Price1Total = FleecesQTY * FeePerAnimal
	else
	Price1Total = 0
end if 

if len(ServiceStartDate) > 0 and DateDiff("d", ServiceStartDate, now()) > 1 and DateDiff("d", ServiceEndDate, now()) < 1 then

 %>
 




<tr>
  <td class = "body" width = "440">

 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Fleece Show Entries 
 
 
  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price1DiscountStartDate %> to <% =Price1DiscountEndDate %>.</small>
	<% end if %>
	<% if MaxQTY > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY %> Fleece Entries Per Exhibitor Per Class.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right" width = "90"><input type = "hidden" value = "<%= FullFeePerAnimal %>" name = "FleeceShowFee">
      <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullFeePerAnimal,2)%></strike></small><img src = "images/px.gif" width = "5" alt = "Flece Show Event Registration"><br>
 			<%=formatcurrency(FeePerAnimal,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerAnimal,2)%>
	
<% end if %>
   
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 


<% end if %>
<% end if %>


<% end if ' SHOW FLEECE SHOW %>



<% '***************************************
   ' AOBA Fee Entries
   '***************************************	
  
'response.write("ShowAOBAFee=" & ShowAOBAFee )

 if ShowAOBAFee = "True" then

	AOBAQTY = request.form("AOBAQTY")

if AOBAQTY < 1 and OldAOBAFeeQuantity > 0 and NOT(Update = "True") then
	AOBAQTY = OldAOBAFeeQuantity
end if
 showdiscount = False
 

 %>
 <tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
 <tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
   
  <tr>
  <td class = "body" width = "440">  
   <input type = "hidden" value = "<%= AOBAFee %>" name = "AOBAFee">
  <img src = "images/px.gif" width = "4" height = "30" alt = "Livestock Event Registration">AOBA Fee for Non-AOBA Show Division Members
 
 <br><small><font color = "brown"><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">This fee only applies if you enter an animal or fleece into <Br><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">the show <b>and</b> you are a Non-AOBA Show Division Member.</font></small>


 </td>
  <td class = "body" align = "right" width = "90">
  <%=formatcurrency(AOBAFee,2)%>


<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 

 

<% end if %>








<%
'************************************************************
'  SPIN OFF SHOW ENTRIES
'************************************************************
if  ShowSpinOff = True  then %>
	<tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
 	<tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Sponsorship Registration"></td></tr>
	  <tr >
		<td class = "body" colspan = "4" height = "30">
	       <img src = "/images/px.gif" width = "5" alt = "Sponsorship Options"><h3>Spin-Off</h3>
	     </td>
	   </tr>


<% sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'SpinOff' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")
	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")

	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")

	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")

	
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY =  rs("ServiceMaxQuantity2")
	if len(MaxQTY) > 0 then
	else
	  MaxQTY = 20
	end if


	MaxQTY2 =  rs("ServiceMaxQuantity2")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if

	
	
End If 



Price1DiscountStartDate = Price1DiscountStartDateMonth & "/" & Price1DiscountStartDateDay & "/" & Price1DiscountStartDateYear
Price1DiscountEndDate = Price1DiscountEndDateMonth & "/" & Price1DiscountEndDateDay & "/" & Price1DiscountEndDateYear

if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 

if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
end if

RegistrationOpen = True 

 if FeePerAnimal > 0 then
SpinOffQTY = request.form("SpinOffQTY")

 showdiscount = False
 
if Price1Discount > 0 and len(Price1DiscountStartDate) > 5 and len(Price1DiscountStartDate) > 5 then
  if DateDiff("d", Price1DiscountStartDate, now()) > 1 and DateDiff("d", Price1DiscountEndDate, now()) < 1 then
 	 FullFeePerAnimal = FeePerAnimal
 	 FeePerAnimal = Price1Discount
 	  showdiscount = True
	end if 
end if



	if SpinOffQTY  = 0 and len(OldSpinOffQuantity) > 0 and NOT(Update = "True")then
		SpinOffQTY = OldSpinOffQuantity
	end if



if len(SpinOffQTY) > 0  and len(FeePerAnimal) > 0 then
	Price1Total = SpinOffQTY * FeePerAnimal
	else
	Price1Total = 0
end if 



if len(ServiceStartDate) > 0 and DateDiff("d", ServiceStartDate, now()) > 1 and DateDiff("d", ServiceEndDate, now()) < 1 then

 %>
 




<tr>
  <td class = "body">

 <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Spin-Off Show Entries 
 
 
  <% if showdiscount = True then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Discount rate from <%=Price1DiscountStartDate %> to <% =Price1DiscountEndDate %>.</small>
	<% end if %>
<% if MaxQTY > 0 then %>  
 	 <br><small><img src = "images/px.gif" width = "10" height = "1" alt = "Event Registration">Max. <% =MaxQTY %> Entries Per Exhibitor Per Class.</small>
	<% end if %>

 </td>
  <td class = "body" align = "right">    <input type = "hidden" value = "<%= FullFeePerAnimal %>" name = "SpinOffFee">
    <% if showdiscount = True then %>   
 	   <small><strike><%=formatcurrency(FullFeePerAnimal,2)%></strike></small><img src = "images/px.gif" width = "10" alt = "Flece Show Event Registration"><br>
 			<%=formatcurrency(FeePerAnimal,2)%>
 			<% else %>
	  <%=formatcurrency(FeePerAnimal,2)%>
	
<% end if %><img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 


<% end if %>
<% end if %>


<% end if ' SHOW Spin Off SHOW %>

 <% 
 '********************************************************************************
 '	ADVERTISING OPTIONS
 '********************************************************************************
  if ShowAdvertising = True then %>

 <% sql = "select * from AdvertisingLevels  where AvaliableByItself =True and EventID = " & EventID 

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Advertising Registration"></td></tr>
 	<tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Advertising Registration"></td></tr>

	<tr>
   <td class = "body" colspan = "4" height ="30">
     <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration"><h3>Advertising</h3>
   </td>
</tr>

	
	<% order = "odd"
	dim AdvertsingQTYArray2(1000)
	While Not rs.eof 
	AdvertisingLevelID = rs("AdvertisingLevelID")
	AdvertisingLevelName = rs("AdvertisingLevelName")
	
	
	'response.write("AdvertisingLevelName = " & AdvertisingLevelName )
	AdvertisingLevelPrice = rs("AdvertisingLevelPrice")
	AdvertisingLevelQTYAvailable = rs("AdvertisingLevelQTYAvailable")
	
	AdvertsingQTYArraycount = "AdvertsingQTYArray(" & AdvertisingLevelID & ")"
	AdvertsingQTYArray2(AdvertisingLevelID) = Request.Form(AdvertsingQTYArraycount)

	'response.write("AdvertsingQTYArray2(AdvertisingLevelID)=" & AdvertsingQTYArray2(AdvertisingLevelID) )
	
	if len(AdvertisingLevelQTYAvailable) > 0 then
	else
	  AdvertisingLevelQTYAvailable = 20
	end if


i = 0
	while i < (TotalAdvertisingCounter + 1 )
	   	i = i + 1
		if OldAdvertisingNameArray(i) = AdvertisingLevelName then
			OldAdvertisingQTY = OldAdvertisingQTYArray(i)
		end if
	wend
	
	
  if AdvertsingQTYArray2(AdvertisingLevelID) < 1 and OldAdvertisingQTY > 0 and NOT(Update = "True") then
 	AdvertsingQTYArray2(AdvertisingLevelID) =  OldAdvertisingQTY
  end if 
	%>
   
<tr>
  <td class = "body">
	<img src = "/images/px.gif" width = "10" alt = "Livestock Event Registration"><%=AdvertisingLevelName %>


 </td>
  <td class = "body" align = "right">
   <%=formatcurrency(AdvertisingLevelPrice) %>
   
		<img src = "/images/px.gif" width = "5" alt = "Livestock Event Registration"> </td>
</tr> 



<% 	
    	
		rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if %>

<% end if %>



 <% 
 '********************************************************************************
 '	VENDOR OPTIONS
 '********************************************************************************

  if showvendors = true then
 
 sql = "select * from VendorLevels  where EventID = " & EventID 

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	
	<tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Advertising Registration"></td></tr>
 	<tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Advertising Registration"></td></tr>
    <tr ><td class = "body" colspan = "4" height ="30"><img src = "/images/px.gif" width = "5"  alt = "Vendor Registration"><h3>Commercial Vendor Options</h3></td></tr>
	<%
	
	order = "odd"
	While Not rs.eof  
	VendorLevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	'response.write("VendorLevelName = " & VendorLevelName )
	VendorStallPrice = rs("VendorStallPrice")
	VendorStallMaxQtyPer = rs("VendorStallMaxQtyPer")
	
	if len(VendorStallMaxQtyPer) > 1 then
	else
	  VendorStallMaxQtyPer = 50
	end if
	
	Costpertable = rs("Costpertable")
	MaxExtraTables = rs("MaxExtraTables")
	if len(MaxExtraTables) < 1 then
	  Numfreetables = 0
	end if
	
	Numfreetables = rs("Numfreetables")
	

	if len(MaxExtraTables) > 0 then
	else
	  MaxExtraTables = 10
	end if


	if len(Numfreetables) > 0 then
	else
	  Numfreetables = 0
	end if
	
	
	'response.write("Numfreetables=" & Numfreetables )
	VendorQTYArraycount = "VendorQTYArray(" & VendorLevelID & ")"
	VendorQTYArray(VendorLevelID) = Request.Form(VendorQTYArraycount)

	'response.write("VendorQTYArray(VendorLevelID)=" & VendorQTYArray(VendorLevelID) )

	VendorTableQTYArraycount = "VendorTableQTYArray(" & VendorLevelID & ")"
	VendorTableQTYArray(VendorLevelID) = Request.Form(VendorTableQTYArraycount)

	'response.write("VendorTableQTYArray(VendorLevelID)=" & VendorTableQTYArray(VendorLevelID) )

	i = 0
	while i < (TotalVendorCounter + 1 )
	   	i = i + 1
	   	'response.write("VendorStallName=" & VendorStallName & "<br>" )
	    	'response.write("OldVendorNameArray(i)=" & OldVendorNameArray(i) & "<br>" )  	
		if OldVendorNameArray(i) = VendorStallName then
			OldVendorQTY = OldVendorQTYArray(i)
			OldVendorTableQTY = OldVendorTableQTYArray(i)
		end if
	wend

	IF VendorQTYArray(VendorLevelID) < 1 and OldVendorQTY > 0 and NOT(Update = "True") then
		VendorQTYArray(VendorLevelID) = OldVendorQTY
	end if


	IF VendorTableQTYArray(VendorLevelID) < 1 and OldVendorTableQTY > 0 and NOT(Update = "True") then
		VendorTableQTYArray(VendorLevelID) = OldVendorTableQTY
	end if





	%>
    <tr>
	<td class = "body">
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration"><%= VendorStallName %><bR>
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration"><small>This option comes with <%=Numfreetables %> table<% if Numfreetables > 1 or Numfreetables = 0 then %>s<% end if %>.</small>
	</td>
	<td class = "body" align = "right">	
		<%= formatcurrency(VendorStallPrice) %><img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
    </td>
 </tr>
   
	   
	 <% if MaxExtraTables > 0 then %>
	<tr>
	<td class = "body" align = "right">
		<img src = "/images/px.gif" width = "10" alt = "Vendor Registration">Extra Tables<bR>
	</td>
	<td class = "body" align = "right">
	  <% if len(Costpertable) > 0 then %>
	  	<%= formatcurrency(Costpertable) %>
	    <% else %>
	      Free
	    <%   	Costpertable = 0 
	     end if %>
	  
	
	  <img src = "/images/px.gif" width = "5" alt = "Vendor Registration">
    </td>


	   </tr>
<% end if %>

<% rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if 
  
  end if
  %>





<%	
 '********************************************************************************
 '	CLASSES OPTIONS
 '********************************************************************************
sql = "select * from Classinfo where EventID = " & EventID & "" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowClasses = True %>
	
	<tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Class Registration"></td></tr>
 	<tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Class Registration"></td></tr>
	<tr ><td class = "body" colspan = "4" height ="30"><img src = "/images/px.gif"  width = "5" alt = "Class Registration"><h3>Classes</h3></td></tr>
	<%

		
	end if 

  if ShowClasses = True then
 
'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	
	order = "odd"
	While Not rs.eof  
		ClassInfoID = rs("ClassInfoID")
		ClassInfoTitle = rs("ClassInfoTitle")
		ClassInfoDescription = rs("ClassInfoDescription")
		ClassInfoMaximumStudents= rs("ClassInfoMaximumStudents")
		ClassInfoStudentFee= rs("ClassInfoStudentFee")
		ClassDateMonth = rs("ClassDateMonth")
		ClassDateDay = rs("ClassDateDay")
		ClassDateYear = rs("ClassDateYear")
	
	if len(ClassDateMonth) > 0 and len(ClassDateDay) > 0 and len(ClassDateYear) > 0 then
	ClassDate = cstr(ClassDateMonth) & "/" & cstr(ClassDateDay) & "/" & cstr(ClassDateYear)
end if

	
	
	if len(ClassInfoMaximumStudents) > 0 then
	else
	  ClassInfoMaximumStudents = 100
	end if
	
	
	ClassInfoRoomDesignation = rs("ClassInfoRoomDesignation")
	
		str1 = ClassInfoTitle
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, " ")
		End If 
		
		str1 = ClassInfoTitle
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			ClassInfoTitle= Replace(str1,  str2, "'")
		End If 	
	
	ClassStartTime = rs("ClassStartTime")
	ClassEndTime = rs("ClassEndTime")
	ClassesQTYArraycount = "ClassesQTYArray(" & ClassInfoID & ")"
	ClassesQTYArray(ClassInfoID) = Request.Form(ClassesQTYArraycount)


	if len(ClassInfoStudentFee) > 0 then
	else
	  ClassInfoStudentFee = 0 
	end if
	
	'response.write("ClassesQTYArray(ClassInfoID)=" & ClassesQTYArray(ClassInfoID) )


i = 0
	while i < (TotalClassesCounter + 1 )
	   	i = i + 1
	   'response.write("OldClassesNameArray(i)=" & OldClassesNameArray(i) & "=" & OldClassesQTYArray(i) & "<br>" )
		if OldClassesNameArray(i) = ClassInfoTitle then
			OldClassesQTY = OldClassesQTYArray(i)
		end if
	wend
	
	
  if ClassesQTYArray(ClassInfoID) < 1 and OldClassesQTY > 0 and NOT(Update = "True") then
 	ClassesQTYArray(ClassInfoID) =  OldClassesQTY
 	
  end if
  
  
	%>
    <tr>
	<td class = "body">
		<img src = "/images/px.gif" width = "10" alt = "Classes Registration"><%= ClassInfoTitle %><br>
		<% if len(ClassDate) > 8 then %>
		  <img src = "/images/px.gif" width = "15" alt = "Classes Registration"><small><%=ClassDate%></small>
		<% end if %>
		<% if len(ClassStartTime) > 0 then %>
			<small><%=ClassStartTime%></small>
		<% end if %>
		<% if len(ClassEndTime) > 0 then %>
			<small> - <%=ClassEndTime%></small>
		<% end if %>
		<% if len(ClassInfoRoomDesignation) > 0 then %>
			<small>Room <%=ClassInfoRoomDesignation%></small>
		<% end if %>

		
		
	</td>
	<td class = "body" align = "right">	
		<% if len(ClassInfoStudentFee) > 0 and ClassInfoStudentFee > 0 then %>
			<%= formatcurrency(ClassInfoStudentFee) %>
		<% else %>
			Free
		<% end if %><img src = "/images/px.gif" width = "5" alt = "Classes Registration">
    </td>
</tr>

<% rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if 
  
  end if
  %>











 <% 
 '********************************************************************************
 '	EXTRA OPTIONS
 '********************************************************************************
 
 
 
 
 
sql = "select * from ExtraOptions where not (OptionType = 'Halter') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor')  and not (OptionType = 'Advertising') and EventID = " & EventID & "" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ShowExtraOptions = True %>
	
	<tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "Advertising Registration"></td></tr>
 	<tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"><img src = "/images/px.gif" width = "1" alt = "Advertising Registration"></td></tr>
	<tr ><td class = "body" colspan = "4" height ="30"><img src = "/images/px.gif" width = "5"  alt = "Vendor Registration"><h3>Other Options</h3></td></tr>
	<%

	end if 

  if ShowExtraOptions = True then
 
'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
	
	order = "odd"
	While Not rs.eof  
	ExtraOptionsID = rs("ExtraOptionsID")
		ExtraOptionsName = rs("ExtraOptionsName")
		ExtraOptionsDescription = rs("ExtraOptionsDescription")
		ExtraOptionsQTYAvailable= rs("ExtraOptionsQTYAvailable")
		ExtraOptionsPrice= rs("ExtraOptionsPrice")
		AvaliableWithSponsorships= rs("AvaliableWithSponsorships")
		AvaliableByItself= rs("AvaliableByItself")
	
	
	if len(ExtraOptionsQTYAvailable) > 0 then
	else
	  ExtraOptionsQTYAvailable = 50
	end if
		str1 = ExtraOptionsName
		str2 = "&nbsp;"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsName= Replace(str1,  str2, " ")
		End If 
		
		str1 = ExtraOptionsName
		str2 = "''"
		If InStr(str1,str2) > 0 Then
			ExtraOptionsName= Replace(str1,  str2, "'")
		End If 	
	
	
	ExtraOptionsQTYArraycount = "ExtraOptionsQTYArray(" & ExtraOptionsID & ")"
	ExtraOptionsQTYArray(ExtraOptionsID) = Request.Form(ExtraOptionsQTYArraycount)

	'response.write("ExtraOptionsQTYArray(ExtraOptionsID)=" & ExtraOptionsQTYArray(ExtraOptionsID) )



i = 0
	while i < (TotalExtraOptionCounter + 1 )
	   	i = i + 1
		if OldExtraOptionNameArray(i) = ExtraOptionsName then
			OldExtraOptionQTY = OldExtraOptionQTYArray(i)
		end if
	wend
	
	
  if ExtraOptionsQTYArray(ExtraOptionsID) < 1 and OldExtraOptionQTY > 0 and NOT(Update = "True") then
 	ExtraOptionsQTYArray(ExtraOptionsID) =  OldExtraOptionQTY
  end if 



	%>
    <tr>
	<td class = "body">
		<img src = "/images/px.gif" width = "10" alt = "ExtraOptions Registration"><%= ExtraOptionsName %><bR>
	</td>
	<td class = "body" align = "right">	
		<%= formatcurrency(ExtraOptionsPrice) %><img src = "/images/px.gif" width = "5" alt = "ExtraOptions Registration">
    </td>
</tr>

<% 	

    	
		rowcount = rowcount + 1
		rs.movenext
	Wend		
  end if 
  
  end if
 %>
 




<%
'************************************************************
'  DINNER TICKETS FEE
'************************************************************
if ShowDinner= "True"  then

sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Dinner' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	Title = rs("Title")
	VegitarianOption = rs("VegitarianOption")

	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")

	if len(Title) > 1 then
	else
	  Title = "Dinner"
	end if

	DinnerFee = rs("Price")
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")

	if len(MaxQTY2) > 0 then
	else
		MaxQTY2 = 100
	end if
	
End If 


if len(ServiceEndDateMonth) > 0 then
  else
  ServiceEndDateMonth = ""
end if 

if len(ServiceEndDateday) > 0 then
  else
  ServiceEndDateday = ""
end if 

if len(ServiceEndDateYear) > 0 then
  else
  ServiceEndDateYear = ""
end if 

if len(ServiceStartDateMonth) > 0 and len(ServiceStartDateDay) > 0 and len(ServiceStartDateYear) > 0 then
	ServiceStartDate = cstr(ServiceStartDateMonth) & "/" & cstr(ServiceStartDateDay) & "/" & cstr(ServiceStartDateYear)
else
   ServiceStartDate = ""
end if

if len(ServiceEndDateMonth) > 0 and len(ServiceEndDateDay) > 0 and len(ServiceEndDateYear) > 0 then
	ServiceEndDate = cstr(ServiceEndDateMonth) & "/" & cstr(ServiceEndDateDay) & "/" & cstr(ServiceEndDateYear)
	else
   ServiceEndDate = ""

end if


OfferDinnerTickets = True


if len(ServiceEndDateMonth) < 1 or len(ServiceEndDateDay) < 1 then
OfferDinnerTickets = True
else
	if DateDiff("d", ServiceEndDate, now()) > 1 then
		OfferDinnerTickets = False
	end if
end if

	if len(DinnerFee) > 0 then
	else
		OfferDinnerTickets = False
	end if


if OfferDinnerTickets = True then
	
	
	DinnerQTY = request.form("DinnerQTY")

if DinnerQTY < 1 and OldDinnerTicketQTY > 0 and NOT(Update = "True") then
	DinnerQTY = OldDinnerTicketQTY
	'OldDinnerTicketQTY = 0
end if

	
	'response.write("VendorTableQTYArray(VendorLevelID)=" & VendorTableQTYArray(VendorLevelID) )


 showdiscount = False
 
 %>
<tr>
  <td class = "body">

  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration"><%=Title %>
  
  <% if len(ServiceEndDate) > 6 then %>
  <br>
  <img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"><small>Registration ends <%=ServiceEndDate %>.</small>
  <% end if %>
  
  
 </td>
  <td class = "body" align = "right">
      <input type = "hidden" value = "<%= DinnerFee %>" name = "DinnerFee">
  <%=formatcurrency(DinnerFee,2)%>
 

<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 


<% 
end if ' if OfferDinnerTickets = True %>





<% if TotalFreeDinnerTicketsQTY > 0 then %>
<tr bgcolor = "#F6F6F6" height = "20">
<td class = "body" align = "right" colspan = "2">
   <small># tickets from sponsorship<% if TotalFreeDinnerTicketsQTY > 1 then %>s<%end if %>:</small>
</td>
</tr>
<% end if %>



<% 
if VegitarianOption = "True" and DinnerQTY > 0 then
	'response.write("OldVegitarianQTY123=" & OldVegitarianQTY )
	DinnerVegQTY = request.form("DinnerVegQTY")
	if DinnerVegQTY < 1 and OldVegitarianQTY > 0 and NOT(Update = "True") then
		DinnerVegQTY = OldVegitarianQTY
	end if
 %>
<tr>
  <td class = "body">

  <img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration">Vegitarian Meals
  
  <br><img src = "images/px.gif" width = "4" height = "1" alt = "Livestock Event Registration"><small>How many of your meals should be vegetarian?</small>


  
 </td>
  <td class = "body" align = "right">

		N/A
 

<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
  <td class = "body" align = "right">

   

 </td>
  <td class = "body" align = "right">  
 	 N/A
<img src = "/images/px.gif" width = "5" alt = "Livestock Event registration"> </td>
</tr> 
<% 
end if ' if vegitary Option = True %>


<% end if ' if ShowDinner  = true %>
 
	<tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "<%=EventName%> Event Registration"></td></tr>
 	<tr ><td class = "body" colspan = "4" height = "1" bgcolor = "#abacab"></td></tr>
	<tr ><td class = "body" colspan = "4" height = "5" ><img src = "/images/px.gif" width = "1" alt = "<%=EventName%> Event Registration"></td></tr>
</table>
</td>
</tr>
<tr>
  <td background = "images/RegistrationFooter.jpg" height = "15"><img src = "images/px.gif" height = "1" width = "1" alt = "<%= EventName %> at Andresen Events - Event Registration"></td></tr>
</table>

<% end if %>
<% end if %>
