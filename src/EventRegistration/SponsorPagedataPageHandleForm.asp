<html>
<head>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body  >
	<!--#Include virtual="Globalvariables.asp"-->


<% SponsorshipLevelName= Request.Form("SponsorshipLevelName")
		SponsorshipLevelDescription = Request.Form("SponsorshipLevelDescription")
		SponsorshipLevelPrice= Request.Form("SponsorshipLevelPrice") 
		SponsorshipLevelQTYAvailable =request.Form("SponsorshipLevelQTYAvailable")
		SponsorshipLevelMaxQtyPer = request.Form("SponsorshipLevelMaxQtyPer")
		
		response.write("SponsorshipLevelPrice=" & SponsorshipLevelPrice)
	if len(SponsorshipLevelName) < 1  or len(SponsorshipLevelPrice) < 1 then
	
	Message ="Your Sponsorship level has not been added. Please enter: <br>"
	   if len(SponsorshipLevelName) < 1 then
		Message = Message & " - Sponsorship TITLE.<br>"
	   end if
	   
	  if len(SponsorshipLevelPrice) < 1 then
		Message = Message & "- Sponsorship PRICE.<br> "
	   end if
 
 	Response.redirect("SponsorshipAdd.asp?EventID=" & EventID & "&Message=" & Message & "<br>" )
 	
 	else %>
 	
 	

	
	
<%	rowcount = 1
	
	Action= Request.Form("Action")
	EventID = Request.Querystring("EventID")
response.write("EventID=" & EventID)

		
		response.write("Action=" & Action & "<br>")
		response.write("SponsorshipLevelName=" & SponsorshipLevelName & "<br>")	
		
		str1 =SponsorshipLevelDescription
		str2 = "'"
		If InStr(str1,str2) > 0 Then
			SponsorshipLevelDescription= Replace(str1,  str2, "''")
		End If  
	
		str1 =SponsorshipLevelName
		str2 = "'"
		If InStr(str1,str2) > 0 Then
			SponsorshipLevelName= Replace(str1,  str2, "''")
		End If  
	
		if len(SponsorLevelID) > 0 or len(SponsorshipLevelName) > 0 or len(SponsorshipLevelDescription) > 0 or len(SponsorshipLevelPrice) > 0 then
			Query =  "INSERT INTO SponsorshipLevels (SponsorshipLevelName, EventID, " 
			if len(SponsorshipLevelMaxQtyPer) > 0 then
					Query =  Query &   " SponsorshipLevelMaxQtyPer ,"
			end if
			
				
			if len(SponsorshipLevelPrice) > 0 then
					Query =  Query &   " SponsorshipLevelPrice ,"
			end if
			if len(SponsorshipLevelQTYAvailable) > 0 then
					Query =  Query &  " SponsorshipLevelQTYAvailable ,"
			end if
			Query =  Query &  " SponsorshipLevelDescription)"
			
			Query =  Query & " Values ('" &  SponsorshipLevelName & "' ,"
			Query =  Query & " " &  EventID & " ,"
			if len(SponsorshipLevelMaxQtyPer) > 0 then
					Query =  Query &   " " & SponsorshipLevelMaxQtyPer & ","
			end if
			
			if len(SponsorshipLevelPrice) > 0 then
					Query =  Query &   " " & SponsorshipLevelPrice & ","
			end if
			if len(SponsorshipLevelQTYAvailable) > 0 then
					Query =  Query &   " " & SponsorshipLevelQTYAvailable & ","
			end if
			
			 Query =  Query &   " '" & SponsorshipLevelDescription & "' )" 
			response.write("Query=" & Query)	
			Conn.Execute(Query) 
			
			
		
				Query =  "INSERT INTO  ExtraOptions (EventID, OptionType, ExtraOptionsName)" 
		Query =  Query & " Values (" &  EventID & " ,"
		Query =  Query & " 'Sponsorship' ,"
		Query =  Query & " '" &  SponsorshipLevelName & "' )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query)
		
			
			
 		end if 
 		
 		
 		sql3 = "select SponsorshipLevelID from SponsorshipLevels where SponsorshipLevelName = '" & SponsorshipLevelName & "' and  EventID = " & EventID
		response.write("<br>sql3=" & sql3 & "<br>")
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if not rs.eof then
			SponsorshipLevelID = rs("SponsorshipLevelID")
			
			response.write("<br>SponsorshipLevelID=" & SponsorshipLevelID & "<br>" )
		end if
	
 		
	End If 

	 
	
	
	ShowDinner = Request.form("ShowDinner")	
	ShowHalterShow = Request.form("ShowHalterShow")	
	response.write("ShowDinner=" & ShowDinner )
	if ShowHalterShow = "True" then

		ExpeditedVetCheck= Request.form("ExpeditedVetCheck")
		if ExpeditedVetCheck > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Expidited Vet Check in' and  EventID = " & EventID
		response.write(sql3)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			ExpeditedVetCheckExtraOptionsID = rs("ExtraOptionsID")
		end if
		response.write("ExpeditedVetCheckExtraOptionsID=" & ExpeditedVetCheckExtraOptionsID )
		



	
		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  ExpeditedVetCheckExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & ExpeditedVetCheck & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query) 
		
		
		end if
		
	


	
		
		FreeHalterStall= Request.form("FreeHalterStall")
		if len(FreeHalterStall) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Halter Stall' and  EventID = " & EventID
		response.write(sql3)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeHalterStallExtraOptionsID = rs("ExtraOptionsID")
		end if
		response.write("FreeHalterStallExtraOptionsID=" & FreeHalterStallExtraOptionsID )
		
		
		sql3 = "select SponsorshipLevelID from SponsorshipLevels where SponsorshipLevelName = '" & SponsorshipLevelName & "' and  EventID = " & EventID
		response.write("<br>sql3=" & sql3 & "<br>")
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if not rs.eof then
			SponsorshipLevelID = rs("SponsorshipLevelID")
			
			response.write("<br>SponsorshipLevelID=" & SponsorshipLevelID & "<br>" )
		end if



		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeHalterStallExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeHalterStall & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query) 


		end if




		FreeDisplayStall= Request.form("FreeDisplayStall")
		if len(FreeDisplayStall) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Display Stall' and  EventID = " & EventID
		response.write(sql3)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeDisplayStallExtraOptionsID = rs("ExtraOptionsID")
		end if
		response.write("FreeDisplayStallExtraOptionsID=" & FreeDisplayStallExtraOptionsID )
		
		


		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeDisplayStallExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeDisplayStall & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query) 



		end if



		FreeVetCheck= Request.form("FreeVetCheck")
		if FreeVetCheck > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Vet Check in' and  EventID = " & EventID
		response.write(sql3)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeVetCheckExtraOptionsID = rs("ExtraOptionsID")
		end if
		response.write("FreeVetCheckExtraOptionsID=" & FreeVetCheckExtraOptionsID )
		
		


		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeVetCheckExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeVetCheck & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query)
		
		end if
		
		
		FreeStallMat= Request.form("FreeStallMat")
		if FreeStallMat > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Stall Mat' and  EventID = " & EventID
		response.write(sql3)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeStallMatExtraOptionsID = rs("ExtraOptionsID")
		end if
		response.write("FreeStallMatExtraOptionsID=" & FreeStallMatExtraOptionsID )
		


		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeStallMatExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeStallMat & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query)
		
		end if
  		
		FreeElectricity= Request.form("FreeElectricity")
		if FreeElectricity > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Electricity' and  EventID = " & EventID
		response.write(sql3)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeElectricityExtraOptionsID = rs("ExtraOptionsID")
		end if
		response.write("FreeElectricityExtraOptionsID=" & FreeElectricityExtraOptionsID )
		
		



		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeElectricityExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeElectricity & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query)
		
		end if


  		
  		'response.write("FreeHalterStall=" & FreeHalterStall )
  		'response.write("FreeDisplayStall=" & FreeDisplayStall )
  		'response.write("ExpeditedVetCheck=" & ExpeditedVetCheck )
  		'response.write("FreeVetCheck=" & FreeVetCheck )






 sql = "select * from ExtraOptions where EventID = " & EventID
			'response.write(sql3)
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3   
			while Not rs.eof 
			ExtraOptionsName = rs("ExtraOptionsName")
			ExtraOptionsID =rs("ExtraOptionsID")
			ExtraOptionQTY = request.form("ExtraOptionQTY" & ExtraOptionsID)
			response.write("ExtraOptionQTY=" & ExtraOptionQTY )
			

			if ExtraOptionQTY > 0 then
			else
			ExtraOptionQTY = 0
			end if
				Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
				Query =  Query & " Values (" &  ExtraOptionsID & " ,"
				Query =  Query & " " &  EventID & " ,"
				Query =  Query & " " &  SponsorshipLevelID & " ,"
				Query =  Query &   " " & ExtraOptionQTY & " )" 
				response.write("Query=" & Query)	
				Conn.Execute(Query)
		
			
			
		 rs.movenext
		wend 




	end if 
	
	
	 if ShowDinner = "True" then 
FreeDinnerTickets= Request.form("FreeDinnerTickets")
response.write("FreeDinnerTickets=" & FreeDinnerTickets )

		if FreeDinnerTickets > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Dinner Ticket(s)' and  EventID = " & EventID
		response.write(sql3)
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeDinnerTicketsOptionsID = rs("ExtraOptionsID")
		end if
		response.write("FreeDinnerTicketsOptionsID=" & FreeDinnerTicketsOptionsID )
			Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & FreeDinnerTicketsOptionsID & " and EventID = " &  EventID
	response.write("Query = " & Query & "<br/>")
	Conn.Execute(Query) 


		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeDinnerTicketsOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeDinnerTickets & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query)
		
		end if
end if


	ShowVendors = Request.form("ShowVendors")
	dim VendorOptionQTY(100)	

	 if ShowVendors = "True" then 

response.write("ShowVendors=" & ShowVendors )
 sql = "select * from VendorLevels  where EventID = " & EventID  
 		   response.write("<br>sql= = " & sql)
		    Set rs = Server.CreateObject("ADODB.Recordset")
    		rs.Open sql, conn, 3, 3 
    		rowcount = 0
    		while not  rs.eof 
    
    			eventID = rs("EventID")
    		
    	VendorLevelID = rs("VendorLevelID")
    		 VendorStallName = rs("VendorStallName")
			 
			 VendorOptionQTYcount = "VendorOptionQTY" & VendorLevelID & ""	
			 VendorOptionQTY(rowcount)=Request.Form(VendorOptionQTYcount) 
		str1 =VendorStallName
		str2 = "'"
		If InStr(str1,str2) > 0 Then
			VendorStallName= Replace(str1,  str2, "''")
		End If  
		
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = '" & VendorStallName & "' and  EventID = " & EventID
		response.write("<br><br><br>sql3=" & sql3 & "<br><br><br>")
		Set rs3 = Server.CreateObject("ADODB.Recordset")
		rs3.Open sql3, conn, 3, 3   
		if Not rs3.eof then
			VendorStallOptionsID = rs3("ExtraOptionsID")
		end if
		response.write("VendorStallOptionsID=" & VendorStallOptionsID )
		
		if len(VendorStallOptionsID) > 0 then
			Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & VendorStallOptionsID & " and EventID = " &  EventID
	response.write("Query = " & Query & "<br/>")
	Conn.Execute(Query) 
		end if


		
		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  VendorStallOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & VendorOptionQTY(rowcount) & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query)

	rs.movenext
			wend


ShowAdvertising = Request.form("ShowAdvertising")
	dim AdvertisingOptionQTY(100)	
response.write("ShowAdvertising=" & ShowAdvertising )
	 if ShowAdvertising = "True" then 


 sql = "select * from AdvertisingLevels  where EventID = " & EventID  
		    Set rs = Server.CreateObject("ADODB.Recordset")
    		rs.Open sql, conn, 3, 3 
    		rowcount = 0
    		while not  rs.eof 
    		rowcount= rowcount + 1 
    		 AdvertisingLevelName = rs("AdvertisingLevelName")
			 AdvertisingLevelID = rs("AdvertisingLevelID")
			 AdvertisingOptionQTYcount = "AdvertisingOptionQTY" & AdvertisingLevelID & ""	
			 AdvertisingOptionQTY(rowcount)=Request.Form(AdvertisingOptionQTYcount) 
		
		
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = '" & AdvertisingLevelName & "' and  EventID = " & EventID
		response.write(sql3)
		Set rs3 = Server.CreateObject("ADODB.Recordset")
		rs3.Open sql3, conn, 3, 3   
		if Not rs3.eof then
			AdvertisingStallOptionsID = rs3("ExtraOptionsID")
		
			
			
			
		end if
		response.write("AdvertisingStallOptionsID=" & AdvertisingStallOptionsID )
		
		
		Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & AdvertisingStallOptionsID & " and EventID = " &  EventID
	response.write("Query = " & Query & "<br/>")
	Conn.Execute(Query) 



		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  AdvertisingStallOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & AdvertisingOptionQTY(rowcount) & " )" 
		response.write("Query=" & Query)	
		Conn.Execute(Query)

	
	
	
			rs.movenext
			wend
end if %>

<% end if %>
<% Response.Redirect("SponsorshipAdd.asp?EventID=" & EventID & "&Message=Your Sponsorship Option Has Been Added.") %>
</Body>
</HTML>