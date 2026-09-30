<html>
<head>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body  >
<!--#Include file="AdminEventGlobalVariables.asp"-->

<% 
	EventID = Request.Querystring("EventID")
	SponsorshipLevelID = Request.Querystring("SponsorshipLevelID")		
	SponsorshipLevelDescription=Request.Form("SponsorshipLevelDescription") 
	SponsorshipLevelName=Request.Form("SponsorshipLevelName") 
	SponsorshipLevelPrice=Request.Form("SponsorshipLevelPrice") 
	SponsorshipLevelQTYAvailable=Request.Form("SponsorshipLevelQTYAvailable")
	SponsorshipLevelMaxQtyPer=Request.Form("SponsorshipLevelMaxQtyPer")
	
			str1 = SponsorshipLevelName			
			str2 = "'"
			If InStr(str1,str2) > 0 Then
				SponsorshipLevelName= Replace(str1, "'", "''")
			End If
			str1 = SponsorshipLevelDescription
			str2 = "'"
			If InStr(str1,str2) > 0 Then
				SponsorshipLevelDescription= Replace(str1, "'", "''")
			End If

				Query =  " UPDATE SponsorshipLevels Set SponsorshipLevelName = '" &  SponsorshipLevelName & "', " 
				if len(SponsorshipLevelMaxQtyPer)> 0 then
				Query =  Query & "  SponsorshipLevelMaxQtyPer = " & SponsorshipLevelMaxQtyPer & "," 
				end if 
				if len(SponsorshipLevelPrice)> 0 then
				Query =  Query & "  SponsorshipLevelPrice = " & SponsorshipLevelPrice & "," 
				end if 
				if len(SponsorshipLevelQTYAvailable)> 0 then
			    Query =  Query & "  SponsorshipLevelQTYAvailable = " & SponsorshipLevelQTYAvailable & "," 
			    end if
			    Query =  Query & "  SponsorshipLevelDescription = '" & SponsorshipLevelDescription & "' " 
				Query =  Query & " where SponsorshipLevelID = " & SponsorshipLevelID & ";" 			
			Conn.Execute(Query) 
	Query =  "Delete  From SponsorshipLevelBenefits where SponsorshipLevelID = " & SponsorshipLevelID & ";" 
	Conn.Execute(Query) 
	
ShowDinner = Request.form("ShowDinner")	
	ShowHalterShow = Request.form("ShowHalterShow")	
	if ShowHalterShow = "True" then
		ExpeditedVetCheck= Request.form("ExpeditedVetCheck")
		if len(ExpeditedVetCheck) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Expidited Vet Check in' and  EventID = " & EventID
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			ExpeditedVetCheckExtraOptionsID = rs("ExtraOptionsID")
		end if
			
			Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" &  ExpeditedVetCheckExtraOptionsID & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query) 

		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  ExpeditedVetCheckExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & ExpeditedVetCheck & " )" 
		Conn.Execute(Query) 
		
		
		end if
		
	


	
		
		FreeHalterStall= Request.form("FreeHalterStall")
		if len(FreeHalterStall) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Halter Stall' and  EventID = " & EventID
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeHalterStallExtraOptionsID = rs("ExtraOptionsID")
		end if
		if len(FreeHalterStallExtraOptionsID) > 0 then
		Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" &  FreeHalterStallExtraOptionsID & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query)
	   else
	   
		Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Halter Stall' )"
 
		Conn.Execute(Query) 
	
		Set rsX = Server.CreateObject("ADODB.Recordset")
		sql = "select ExtraOptionsID from ExtraOptions where OptionType = 'Halter' and OptionType = 'Free Halter Stall' and EventID = " & EventID
	rsX.Open sql, conn, 3, 3
	If not rsX.eof then
	    FreeHalterStallExtraOptionsID = rsX("ExtraOptionsID")
	 end if
	 rsX.close
           end if
		
		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeHalterStallExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeHalterStall & " )" 

		Conn.Execute(Query) 

		end if

		FreeDisplayStall= Request.form("FreeDisplayStall")
		if len(FreeDisplayStall) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Display Stall' and  EventID = " & EventID
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeDisplayStallExtraOptionsID = rs("ExtraOptionsID")
		end if
	
	
		if len(FreeDisplayStallExtraOptionsID) > 0 then	
			Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" &  FreeDisplayStallExtraOptionsID & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query)
	 else
	   
	Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Display Stall' )"
 
		Conn.Execute(Query) 
	
		Set rsX = Server.CreateObject("ADODB.Recordset")
		sql = "select ExtraOptionsID from ExtraOptions where OptionType = 'Halter' and OptionType = 'Free Display Stall' and EventID = " & EventID
	rsX.Open sql, conn, 3, 3
	If not rsX.eof then
	   FreeDisplayStallExtraOptionsID = rsX("ExtraOptionsID")
	 end if
	 rsX.close
           end if
           
           
	
		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeDisplayStallExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeDisplayStall & " )" 
		Conn.Execute(Query) 
		end if

		FreeVetCheck= Request.form("FreeVetCheck")
		if len(FreeVetCheck) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Vet Check in' and  EventID = " & EventID
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeVetCheckExtraOptionsID = rs("ExtraOptionsID")
		end if
		
		if len( FreeVetCheckExtraOptionsID) > 0 then
		Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" &  FreeVetCheckExtraOptionsID  & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query)
else
	   
	Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Vet Check in' )"	
		Conn.Execute(Query) 
	
		Set rsX = Server.CreateObject("ADODB.Recordset")
		sql = "select ExtraOptionsID from ExtraOptions where OptionType = 'Halter' and OptionType = 'Free Vet Check in' and EventID = " & EventID
	rsX.Open sql, conn, 3, 3
	If not rsX.eof then
	    FreeVetCheckExtraOptionsID = rsX("ExtraOptionsID")
	 end if
	 rsX.close
           end if
           
		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeVetCheckExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeVetCheck & " )" 
		Conn.Execute(Query)
		
		end if
		
		
		FreeStallMat= Request.form("FreeStallMat")
		if len(FreeStallMat) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Stall Mat' and  EventID = " & EventID
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeStallMatExtraOptionsID = rs("ExtraOptionsID")
		end if
		
			Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & FreeStallMatExtraOptionsID  & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query)

		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeStallMatExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeStallMat & " )" 
		Conn.Execute(Query)
		
		end if
  		
		FreeElectricity= Request.form("FreeElectricity")
		if FreeElectricity > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Electricity' and  EventID = " & EventID
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeElectricityExtraOptionsID = rs("ExtraOptionsID")
		end if
			
			Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & FreeElectricityExtraOptionsID  & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query)



		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeElectricityExtraOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeElectricity & " )" 
		Conn.Execute(Query)
		
		end if

 sql = "select * from ExtraOptions where EventID = " & EventID
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3   
			while Not rs.eof 
			ExtraOptionsName = rs("ExtraOptionsName")
			ExtraOptionsID =rs("ExtraOptionsID")
			ExtraOptionQTY = request.form("ExtraOptionQTY" & ExtraOptionsID)			
			
			if len(ExtraOptionQTY) > 0 then
			
			Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & ExtraOptionsID  & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query)

				Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
				Query =  Query & " Values (" &  ExtraOptionsID & " ,"
				Query =  Query & " " &  EventID & " ,"
				Query =  Query & " " &  SponsorshipLevelID & " ,"
				Query =  Query &   " " & ExtraOptionQTY & " )" 

				Conn.Execute(Query)
			end if
			
			
		 rs.movenext
		wend 




	end if 
	
	
	 if ShowDinner = "True" then 
FreeDinnerTickets= Request.form("FreeDinnerTickets")
		if len(FreeDinnerTickets) > 0 then
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = 'Free Dinner Ticket(s)' and  EventID = " & EventID
		Set rs = Server.CreateObject("ADODB.Recordset")
		rs.Open sql3, conn, 3, 3   
		if Not rs.eof then
			FreeDinnerTicketsOptionsID = rs("ExtraOptionsID")
		end if
		
	if len(FreeDinnerTicketsOptionsID) > 0 then	
	Query =  "Delete From SponsorshipLevelBenefits where ExtraOptionID =" & FreeDinnerTicketsOptionsID  & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query)
else
	   
		Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Dinner'," 
		Query =  Query &  " 'Free Dinner Ticket(s)' )"
 
		Conn.Execute(Query) 
	
		Set rsX = Server.CreateObject("ADODB.Recordset")
		sql = "select ExtraOptionsID from ExtraOptions where OptionType = 'Halter' and OptionType = 'Free Dinner Ticket(s)' and EventID = " & EventID
	rsX.Open sql, conn, 3, 3
	If not rsX.eof then
	    FreeDinnerTicketsOptionsID = rsX("ExtraOptionsID")
	 end if
	 rsX.close
           end if


		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  FreeDinnerTicketsOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & FreeDinnerTickets & " )" 

		Conn.Execute(Query)
		
		end if
end if


ShowVendors = Request.form("ShowVendors")
	dim VendorOptionQTY(100)	
	 if ShowVendors = "True" then 

 sql = "select * from VendorLevels  where EventID = " & EventID  
		    Set rs = Server.CreateObject("ADODB.Recordset")
    		rs.Open sql, conn, 3, 3 
    		rowcount = 0
    		while not  rs.eof 
    		rowcount= rowcount + 1 
    		 VendorStallName = rs("VendorStallName")
			 VendorLevelID = rs("VendorLevelID")
			 VendorOptionQTYcount = "VendorOptionQTY" & VendorLevelID & ""	
			 VendorOptionQTY(rowcount)=Request.Form(VendorOptionQTYcount) 
		    	str1 =VendorStallName
		str2 = "'"
		If InStr(str1,str2) > 0 Then
			VendorStallName= Replace(str1,  str2, "''")
		End If  
		sql3 = "select ExtraOptionsID from ExtraOptions where ExtraOptionsName = '" & VendorStallName & "' and  EventID = " & EventID
		Set rs3 = Server.CreateObject("ADODB.Recordset")
		rs3.Open sql3, conn, 3, 3   
		if Not rs3.eof then
			VendorStallOptionsID = rs3("ExtraOptionsID")
		end if
		
		if len(VendorOptionQTY(rowcount)) > 0 then
		
		Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & VendorStallOptionsID & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID

	Conn.Execute(Query) 


		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  VendorStallOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & VendorOptionQTY(rowcount) & " )" 
		Conn.Execute(Query)

			 end if


rs.movenext
wend
end if



	ShowAdvertising = Request.form("ShowAdvertising")
	dim AdvertisingOptionQTY(100)	
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

		Set rs3 = Server.CreateObject("ADODB.Recordset")
		rs3.Open sql3, conn, 3, 3   
		if Not rs3.eof then
			AdvertisingStallOptionsID = rs3("ExtraOptionsID")
		end if
				
		'if len(AdvertisingOptionQTY(rowcount)) > 0 then
		
		Query =  "Delete * From SponsorshipLevelBenefits where ExtraOptionID =" & AdvertisingStallOptionsID & " and SponsorshipLevelID = " & SponsorshipLevelID & " and EventID = " &  EventID
	Conn.Execute(Query) 

		
		Query =  "INSERT INTO SponsorshipLevelBenefits (ExtraOptionID, EventID, SponsorshipLevelID, SponsorshipLevelQTY)" 
		Query =  Query & " Values (" &  AdvertisingStallOptionsID & " ,"
		Query =  Query & " " &  EventID & " ,"
		Query =  Query & " " &  SponsorshipLevelID & " ,"
		Query =  Query &   " " & AdvertisingOptionQTY(rowcount) & " )" 
		Conn.Execute(Query)

		' end if
	Conn.Execute(Query) 

			rs.movenext
			wend
end if %>

<% Response.Redirect("SponsorEditDetails.asp?EventID=" & EventID & "&SponsorshipLevelID=" & SponsorshipLevelID & "&Message=Your Sponsorship Option Has Been Updated.") %>
</Body>
</HTML>